// Minimal 2D rigid-body solver for the Tumble Wall pile.
// Every body is a convex "core" (point, segment or quad) inflated by a skin radius,
// which covers circles, pills and rounded rectangles with one collision routine.

export type Vec = [number, number]

export type Body = {
  x: number
  y: number
  a: number
  vx: number
  vy: number
  w: number
  im: number // inverse mass
  ii: number // inverse inertia
  core: Vec[] // local core vertices
  r: number // skin radius
  bound: number // bounding radius around the centre
  wc: Vec[] // world-space core vertices (cache)
  active: boolean // takes part in the simulation
  inside: boolean // has fully entered the frame through the entry edge
  contacts: number
}

type Contact = {
  a: number // body index, -1 for static
  b: number
  px: number
  py: number
  nx: number
  ny: number
  depth: number
  rax: number
  ray: number
  rbx: number
  rby: number
  mn: number
  mt: number
  bias: number
  jn: number
  jt: number
}

export type World = {
  bodies: Body[]
  width: number
  height: number
  gravityX: number
  gravityY: number
  bounce: number
  friction: number
  airFriction: number
  drift: number
  contain: boolean
  entryTop: boolean
  time: number
  held: { index: number; lx: number; ly: number; tx: number; ty: number; stiffness: number } | null
}

const G = 1000 // px/s² at gravity 1
const SLOP = 0.5
const BAUMGARTE = 0.22
const ITER = 8

export function makeBody(core: Vec[], r: number, area: number, inertiaFactor: number): Body {
  const mass = Math.max(1e-3, area * 0.001)
  const inertia = mass * inertiaFactor
  let bound = 0
  for (const [x, y] of core) bound = Math.max(bound, Math.hypot(x, y))
  return {
    x: 0,
    y: 0,
    a: 0,
    vx: 0,
    vy: 0,
    w: 0,
    im: 1 / mass,
    ii: 1 / inertia,
    core,
    r,
    bound: bound + r,
    wc: core.map(() => [0, 0] as Vec),
    active: false,
    inside: false,
    contacts: 0,
  }
}

function updateWorld(b: Body) {
  const c = Math.cos(b.a)
  const s = Math.sin(b.a)
  for (let i = 0; i < b.core.length; i++) {
    const [lx, ly] = b.core[i]
    b.wc[i][0] = b.x + lx * c - ly * s
    b.wc[i][1] = b.y + lx * s + ly * c
  }
}

function closestOnSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number, out: Vec) {
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  let t = len2 > 1e-9 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0
  t = t < 0 ? 0 : t > 1 ? 1 : t
  out[0] = ax + dx * t
  out[1] = ay + dy * t
}

const tmp: Vec = [0, 0]
const best: Vec = [0, 0]

function closestOnCore(px: number, py: number, v: Vec[], out: Vec) {
  const n = v.length
  if (n === 1) {
    out[0] = v[0][0]
    out[1] = v[0][1]
    return
  }
  let bd = Infinity
  const edges = n === 2 ? 1 : n
  for (let i = 0; i < edges; i++) {
    const p = v[i]
    const q = v[(i + 1) % n]
    closestOnSegment(px, py, p[0], p[1], q[0], q[1], tmp)
    const d = (tmp[0] - px) ** 2 + (tmp[1] - py) ** 2
    if (d < bd) {
      bd = d
      out[0] = tmp[0]
      out[1] = tmp[1]
    }
  }
}

function project(v: Vec[], ax: number, ay: number): [number, number] {
  let mn = Infinity
  let mx = -Infinity
  for (const p of v) {
    const d = p[0] * ax + p[1] * ay
    if (d < mn) mn = d
    if (d > mx) mx = d
  }
  return [mn, mx]
}

// SAT on cores. Returns null when the cores are separated.
function satCores(A: Body, B: Body): { depth: number; nx: number; ny: number } | null {
  let minD = Infinity
  let bnx = 0
  let bny = 0
  const test = (v: Vec[]) => {
    const n = v.length
    if (n < 2) return true
    const edges = n === 2 ? 1 : n
    for (let i = 0; i < edges; i++) {
      const p = v[i]
      const q = v[(i + 1) % n]
      let ax = -(q[1] - p[1])
      let ay = q[0] - p[0]
      const l = Math.hypot(ax, ay)
      if (l < 1e-9) continue
      ax /= l
      ay /= l
      const [a0, a1] = project(A.wc, ax, ay)
      const [b0, b1] = project(B.wc, ax, ay)
      const o = Math.min(a1 - b0, b1 - a0)
      if (o <= 0) return false
      if (o < minD) {
        minD = o
        bnx = ax
        bny = ay
      }
    }
    return true
  }
  if (!test(A.wc) || !test(B.wc)) return null
  if (minD === Infinity) return null
  if (bnx * (B.x - A.x) + bny * (B.y - A.y) < 0) {
    bnx = -bnx
    bny = -bny
  }
  return { depth: minD, nx: bnx, ny: bny }
}

type Cand = { px: number; py: number; nx: number; ny: number; depth: number }

function collide(A: Body, B: Body, ia: number, ib: number, out: Contact[]) {
  const dx = B.x - A.x
  const dy = B.y - A.y
  const rr = A.bound + B.bound + 1
  if (dx * dx + dy * dy > rr * rr) return
  const ra = A.r
  const rb = B.r
  if (A.core.length >= 3 || B.core.length >= 3) {
    const sat = satCores(A, B)
    if (sat) {
      // Deep overlap of the cores: push along the SAT axis from the deepest vertex of B.
      let mn = Infinity
      let vx = B.x
      let vy = B.y
      for (const p of B.wc) {
        const d = p[0] * sat.nx + p[1] * sat.ny
        if (d < mn) {
          mn = d
          vx = p[0]
          vy = p[1]
        }
      }
      out.push(mkContact(ia, ib, vx, vy, sat.nx, sat.ny, sat.depth + ra + rb))
      return
    }
  }
  const cands: Cand[] = []
  const sum = ra + rb
  for (const p of A.wc) {
    closestOnCore(p[0], p[1], B.wc, best)
    let nx = best[0] - p[0]
    let ny = best[1] - p[1]
    const d = Math.hypot(nx, ny)
    if (d - sum > 1) continue
    if (d < 1e-6) {
      const l = Math.hypot(dx, dy) || 1
      nx = dx / l
      ny = dy / l
    } else {
      nx /= d
      ny /= d
    }
    const k = ra + (d - sum) / 2
    cands.push({ px: p[0] + nx * k, py: p[1] + ny * k, nx, ny, depth: sum - d })
  }
  for (const p of B.wc) {
    closestOnCore(p[0], p[1], A.wc, best)
    let nx = p[0] - best[0]
    let ny = p[1] - best[1]
    const d = Math.hypot(nx, ny)
    if (d - sum > 1) continue
    if (d < 1e-6) {
      const l = Math.hypot(dx, dy) || 1
      nx = dx / l
      ny = dy / l
    } else {
      nx /= d
      ny /= d
    }
    const k = ra + (d - sum) / 2
    cands.push({ px: best[0] + nx * k, py: best[1] + ny * k, nx, ny, depth: sum - d })
  }
  if (!cands.length) return
  cands.sort((p, q) => q.depth - p.depth)
  const c0 = cands[0]
  out.push(mkContact(ia, ib, c0.px, c0.py, c0.nx, c0.ny, c0.depth))
  for (let i = 1; i < cands.length; i++) {
    const c = cands[i]
    if (c.nx * c0.nx + c.ny * c0.ny < 0.96) continue
    if ((c.px - c0.px) ** 2 + (c.py - c0.py) ** 2 < 9) continue
    out.push(mkContact(ia, ib, c.px, c.py, c0.nx, c0.ny, c.depth))
    break
  }
}

function mkContact(a: number, b: number, px: number, py: number, nx: number, ny: number, depth: number): Contact {
  return { a, b, px, py, nx, ny, depth, rax: 0, ray: 0, rbx: 0, rby: 0, mn: 0, mt: 0, bias: 0, jn: 0, jt: 0 }
}

function wallContacts(w: World, b: Body, ib: number, out: Contact[]) {
  const W = w.width
  const H = w.height
  const r = b.r
  const topActive = w.entryTop ? b.inside && w.contain : true
  const bottomActive = w.entryTop ? true : b.inside && w.contain
  for (const p of b.wc) {
    // Contacts treat the wall as body A (static) and the normal points from the wall into the body.
    let d = p[0] - r
    if (d < 1) out.push(mkContact(-1, ib, p[0] - r, p[1], 1, 0, -d))
    d = W - p[0] - r
    if (d < 1) out.push(mkContact(-1, ib, p[0] + r, p[1], -1, 0, -d))
    if (bottomActive) {
      d = H - p[1] - r
      if (d < 1) out.push(mkContact(-1, ib, p[0], p[1] + r, 0, -1, -d))
    }
    if (topActive) {
      d = p[1] - r
      if (d < 1) out.push(mkContact(-1, ib, p[0], p[1] - r, 0, 1, -d))
    }
  }
}

const contacts: Contact[] = []

export function step(w: World, dt: number) {
  const bodies = w.bodies
  const n = bodies.length
  w.time += dt
  const air = Math.pow(1 - Math.min(0.99, Math.max(0, w.airFriction)), dt * 60)
  const gx = w.gravityX * G
  const gy = w.gravityY * G
  // Forces
  for (let i = 0; i < n; i++) {
    const b = bodies[i]
    if (!b.active) continue
    b.vx += gx * dt
    b.vy += gy * dt
    if (w.drift) {
      const t = w.time
      b.vx += Math.sin(t * 0.31 + b.y * 0.011 + i) * w.drift * 220 * dt
      b.vy += Math.cos(t * 0.27 + b.x * 0.009 + i * 1.7) * w.drift * 220 * dt
    }
    b.vx *= air
    b.vy *= air
    b.w *= air
    // Track entry
    if (!b.inside) {
      if (w.entryTop ? b.y - b.bound >= 0 : b.y + b.bound <= w.height) b.inside = true
    }
  }
  // Drag constraint
  const held = w.held
  if (held && bodies[held.index]?.active) {
    const b = bodies[held.index]
    const c = Math.cos(b.a)
    const s = Math.sin(b.a)
    const rx = held.lx * c - held.ly * s
    const ry = held.lx * s + held.ly * c
    const px = b.x + rx
    const py = b.y + ry
    const k = 6 + held.stiffness * 60
    const vdx = (held.tx - px) * k
    const vdy = (held.ty - py) * k
    const vpx = b.vx - b.w * ry
    const vpy = b.vy + b.w * rx
    const ex = vdx - vpx
    const ey = vdy - vpy
    const k11 = b.im + b.ii * ry * ry
    const k12 = -b.ii * rx * ry
    const k22 = b.im + b.ii * rx * rx
    const det = k11 * k22 - k12 * k12
    if (Math.abs(det) > 1e-12) {
      const f = Math.min(1, 0.35 + held.stiffness)
      const jx = ((k22 * ex - k12 * ey) / det) * f
      const jy = ((-k12 * ex + k11 * ey) / det) * f
      b.vx += jx * b.im
      b.vy += jy * b.im
      b.w += b.ii * (rx * jy - ry * jx)
    }
    b.w *= 0.985
  }
  // Collisions
  contacts.length = 0
  for (let i = 0; i < n; i++) {
    const b = bodies[i]
    b.contacts = 0
    if (b.active) updateWorld(b)
  }
  for (let i = 0; i < n; i++) {
    const A = bodies[i]
    if (!A.active) continue
    for (let j = i + 1; j < n; j++) {
      const B = bodies[j]
      if (!B.active) continue
      collide(A, B, i, j, contacts)
    }
    wallContacts(w, A, i, contacts)
  }
  // Prepare
  const e = Math.max(0, Math.min(0.95, w.bounce))
  const inv = 1 / dt
  for (const ct of contacts) {
    const A = ct.a >= 0 ? bodies[ct.a] : null
    const B = bodies[ct.b]
    if (A) A.contacts++
    B.contacts++
    const ima = A ? A.im : 0
    const iia = A ? A.ii : 0
    ct.rax = A ? ct.px - A.x : 0
    ct.ray = A ? ct.py - A.y : 0
    ct.rbx = ct.px - B.x
    ct.rby = ct.py - B.y
    const rna = ct.rax * ct.ny - ct.ray * ct.nx
    const rnb = ct.rbx * ct.ny - ct.rby * ct.nx
    ct.mn = 1 / (ima + B.im + iia * rna * rna + B.ii * rnb * rnb)
    const tx = -ct.ny
    const ty = ct.nx
    const rta = ct.rax * ty - ct.ray * tx
    const rtb = ct.rbx * ty - ct.rby * tx
    ct.mt = 1 / (ima + B.im + iia * rta * rta + B.ii * rtb * rtb)
    const vn = relVel(A, B, ct, ct.nx, ct.ny)
    ct.bias = BAUMGARTE * inv * Math.max(0, ct.depth - SLOP)
    if (ct.bias > 900) ct.bias = 900
    if (vn < -90) ct.bias = Math.max(ct.bias, -e * vn)
  }
  // Solve
  const mu = Math.max(0, Math.min(1.5, w.friction))
  for (let it = 0; it < ITER; it++) {
    for (const ct of contacts) {
      const A = ct.a >= 0 ? bodies[ct.a] : null
      const B = bodies[ct.b]
      const vn = relVel(A, B, ct, ct.nx, ct.ny)
      let dj = ct.mn * (-vn + ct.bias)
      const j0 = ct.jn
      ct.jn = Math.max(0, j0 + dj)
      dj = ct.jn - j0
      apply(A, B, ct, ct.nx * dj, ct.ny * dj)
      const tx = -ct.ny
      const ty = ct.nx
      const vt = relVel(A, B, ct, tx, ty)
      let dt2 = ct.mt * -vt
      const maxF = mu * ct.jn
      const t0 = ct.jt
      ct.jt = Math.max(-maxF, Math.min(maxF, t0 + dt2))
      dt2 = ct.jt - t0
      apply(A, B, ct, tx * dt2, ty * dt2)
    }
  }
  // Integrate
  for (let i = 0; i < n; i++) {
    const b = bodies[i]
    if (!b.active) continue
    const sp = b.vx * b.vx + b.vy * b.vy
    if (sp > 16e6) {
      const k = 4000 / Math.sqrt(sp)
      b.vx *= k
      b.vy *= k
    }
    if (b.w > 40) b.w = 40
    else if (b.w < -40) b.w = -40
    // Kill micro-jitter of resting bodies.
    if (b.contacts > 0 && sp < 64 && Math.abs(b.w) < 0.12 && (!held || held.index !== i)) {
      b.vx *= 0.85
      b.vy *= 0.85
      b.w *= 0.85
    }
    b.x += b.vx * dt
    b.y += b.vy * dt
    b.a += b.w * dt
    // Lost bodies: put them back above the entry edge.
    if (b.x < -2000 || b.x > w.width + 2000 || b.y > w.height + 3000 || b.y < -3000) {
      b.x = w.width / 2
      b.y = w.entryTop ? -b.bound : w.height + b.bound
      b.vx = b.vy = b.w = 0
      b.inside = false
    }
  }
}

function relVel(A: Body | null, B: Body, ct: Contact, nx: number, ny: number) {
  const vbx = B.vx - B.w * ct.rby
  const vby = B.vy + B.w * ct.rbx
  let vax = 0
  let vay = 0
  if (A) {
    vax = A.vx - A.w * ct.ray
    vay = A.vy + A.w * ct.rax
  }
  return (vbx - vax) * nx + (vby - vay) * ny
}

function apply(A: Body | null, B: Body, ct: Contact, px: number, py: number) {
  if (A) {
    A.vx -= px * A.im
    A.vy -= py * A.im
    A.w -= A.ii * (ct.rax * py - ct.ray * px)
  }
  B.vx += px * B.im
  B.vy += py * B.im
  B.w += B.ii * (ct.rbx * py - ct.rby * px)
}

export function kineticLevel(w: World) {
  let m = 0
  for (const b of w.bodies) {
    if (!b.active) continue
    const v = b.vx * b.vx + b.vy * b.vy + b.w * b.w * 400
    if (v > m) m = v
  }
  return m
}

// Point-in-body test in world space (core distance <= skin radius, or inside a quad core).
export function hitTest(b: Body, x: number, y: number) {
  updateWorld(b)
  if (b.wc.length >= 3) {
    let inside = true
    const n = b.wc.length
    let sign = 0
    for (let i = 0; i < n; i++) {
      const p = b.wc[i]
      const q = b.wc[(i + 1) % n]
      const c = (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0])
      if (c !== 0) {
        if (sign === 0) sign = Math.sign(c)
        else if (Math.sign(c) !== sign) {
          inside = false
          break
        }
      }
    }
    if (inside) return true
  }
  closestOnCore(x, y, b.wc, best)
  return (best[0] - x) ** 2 + (best[1] - y) ** 2 <= b.r * b.r
}
