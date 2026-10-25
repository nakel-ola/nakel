import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type Ref,
} from 'react'
import { hitTest, kineticLevel, makeBody, step, type Body, type Vec, type World } from './physics'

export type TumbleWallItem = {
  src?: string
  alt?: string
  title?: string
  href?: string
}

export type TumbleWallHandle = {
  drop: () => void
  shake: (strength?: number) => void
  pop: (x: number, y: number, strength?: number) => void
}

export type TumbleWallProps = {
  items?: TumbleWallItem[]
  count?: number
  shape?: 'circle' | 'square' | 'card' | 'chip' | 'mixed'
  size?: number
  sizeVariance?: number
  fill?: number
  radius?: number
  frame?: 'none' | 'border' | 'polaroid'
  frameWidth?: number
  frameColor?: string
  textColor?: string
  backgroundColor?: string
  shadow?: number
  showTitles?: boolean
  monochrome?: boolean
  hoverScale?: number
  gravity?: number
  gravityX?: number
  bounce?: number
  friction?: number
  airFriction?: number
  spin?: number
  drift?: number
  entrance?: 'rain' | 'burst' | 'drop' | 'none'
  stagger?: number
  draggable?: boolean
  dragStiffness?: number
  throwStrength?: number
  popForce?: number
  contain?: boolean
  paused?: boolean
  ariaLabel?: string
  onSelect?: (item: TumbleWallItem, index: number) => void
  ref?: Ref<TumbleWallHandle>
  className?: string
  style?: CSSProperties
}

// Default pile: generated initials avatars (no photos of real people).
const AVATAR_PEOPLE: [string, string, string][] = [
  ['Mara Quill', '#f97316', '#7c2d12'],
  ['Theo Brandt', '#3b82f6', '#1e3a8a'],
  ['Ines Okafor', '#84cc16', '#365314'],
  ['Jonah Vale', '#a1a1aa', '#27272a'],
  ['Lena Moritz', '#f59e0b', '#78350f'],
  ['Rafi Haddad', '#14b8a6', '#134e4a'],
  ['Cleo Barnes', '#f43f5e', '#881337'],
  ['Arlo Kim', '#8b5cf6', '#3b0764'],
  ['Nadia Ferro', '#ec4899', '#831843'],
  ['Owen Price', '#22c55e', '#14532d'],
  ['Saskia Lund', '#e5e7eb', '#52525b'],
  ['Dev Patel', '#0ea5e9', '#0c4a6e'],
]

function avatarSrc(name: string, a: string, b: string) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="100" y="100" dy="0.35em" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="76" font-weight="600" fill="rgba(255,255,255,0.92)">${initials}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const DEFAULT_TUMBLE_ITEMS: TumbleWallItem[] = AVATAR_PEOPLE.map(([name, a, b]) => ({
  src: avatarSrc(name, a, b),
  title: name.split(' ')[0],
  alt: `Avatar for ${name}`,
}))

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let measureCtx: CanvasRenderingContext2D | null = null
function textWidth(text: string, px: number) {
  if (typeof document === 'undefined') return text.length * px * 0.55
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d')
  if (!measureCtx) return text.length * px * 0.55
  measureCtx.font = `500 ${px}px system-ui, -apple-system, "Segoe UI", sans-serif`
  return measureCtx.measureText(text).width
}

type Kind = 'circle' | 'square' | 'card' | 'chip' | 'tag'

type Spec = {
  item: TumbleWallItem
  itemIndex: number
  kind: Kind
  factor: number // size multiplier from variance
}

type Geo = {
  w: number
  h: number
  kind: Kind
  radiusCss: string
  innerRadiusCss: string
  pad: number // frame width (px)
  bottom: number // polaroid bottom band (px)
  font: number
  avatar: number
}

function computeGeo(spec: Spec, base: number, scale: number, radius: number, frame: string, frameWidth: number): Geo {
  const s = scale * spec.factor
  const unit = base * s
  const fw = frame === 'none' ? 0 : frameWidth * s
  const rad = radius * s
  const title = spec.item.title ?? ''
  switch (spec.kind) {
    case 'circle': {
      return { w: unit, h: unit, kind: 'circle', radiusCss: '50%', innerRadiusCss: '50%', pad: fw, bottom: 0, font: 12 * s, avatar: 0 }
    }
    case 'square':
    case 'card': {
      const photoW = unit - fw * 2
      const photoH = spec.kind === 'card' ? (unit * 4) / 3 - fw * 2 : photoW
      const font = Math.max(9, 13 * s)
      const bottom = frame === 'polaroid' ? Math.max(fw, font * 1.5 + fw * 1.2) : fw
      const h = photoH + fw + bottom
      return {
        w: unit,
        h,
        kind: spec.kind,
        radiusCss: `${rad}px`,
        innerRadiusCss: `${Math.max(0, rad - fw)}px`,
        pad: fw,
        bottom,
        font,
        avatar: 0,
      }
    }
    case 'chip': {
      const h = unit * 0.4
      const font = h * 0.34
      const avatar = h - h * 0.24
      const w = h * 0.12 + avatar + h * 0.22 + textWidth(title || 'Item', font) + h * 0.42
      return { w, h, kind: 'chip', radiusCss: '9999px', innerRadiusCss: '9999px', pad: 0, bottom: 0, font, avatar }
    }
    case 'tag':
    default: {
      const h = unit * 0.4
      const font = h * 0.36
      const w = textWidth(title || 'Tag', font) + h * 0.9
      return { w, h, kind: 'tag', radiusCss: '9999px', innerRadiusCss: '9999px', pad: 0, bottom: 0, font, avatar: 0 }
    }
  }
}

function makeCore(g: Geo, radiusPx: number): { core: Vec[]; r: number; area: number; inertia: number } {
  const hw = g.w / 2
  const hh = g.h / 2
  if (g.kind === 'circle') return { core: [[0, 0]], r: hw, area: Math.PI * hw * hw, inertia: (hw * hw) / 2 }
  if (g.kind === 'chip' || g.kind === 'tag') {
    const L = Math.max(0, hw - hh)
    return { core: [[-L, 0], [L, 0]], r: hh, area: g.w * g.h, inertia: (g.w * g.w + g.h * g.h) / 12 }
  }
  const cr = Math.max(2, Math.min(radiusPx, Math.min(hw, hh) - 0.5))
  const ax = hw - cr
  const ay = hh - cr
  return {
    core: [
      [-ax, -ay],
      [ax, -ay],
      [ax, ay],
      [-ax, ay],
    ],
    r: cr,
    area: g.w * g.h,
    inertia: (g.w * g.w + g.h * g.h) / 12,
  }
}

export function TumbleWall({
  items = DEFAULT_TUMBLE_ITEMS,
  count = 24,
  shape = 'circle',
  size = 116,
  sizeVariance = 0.4,
  fill = 0.4,
  radius = 18,
  frame = 'none',
  frameWidth = 6,
  frameColor = '#FFFFFF',
  textColor = '#0A0A0A',
  backgroundColor = 'transparent',
  shadow = 0.5,
  showTitles = true,
  monochrome = false,
  hoverScale = 1.06,
  gravity = 1,
  gravityX = 0,
  bounce = 0.32,
  friction = 0.3,
  airFriction = 0.012,
  spin = 0.5,
  drift = 0,
  entrance = 'rain',
  stagger = 55,
  draggable = true,
  dragStiffness = 0.2,
  throwStrength = 1,
  popForce = 1,
  contain = true,
  paused = false,
  ariaLabel = 'Photo pile',
  onSelect,
  ref,
  className,
  style,
}: TumbleWallProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const elRefs = useRef<(HTMLElement | null)[]>([])
  const descId = useId()
  const [box, setBox] = useState({ w: 0, h: 0 })

  const n = Math.max(1, Math.min(80, Math.round(count)))
  const list = items.length ? items : DEFAULT_TUMBLE_ITEMS

  // Body specs: deterministic per index so remounts look the same.
  const specs = useMemo<Spec[]>(() => {
    const rnd = mulberry32(1234567)
    const out: Spec[] = []
    for (let i = 0; i < n; i++) {
      const itemIndex = i % list.length
      const item = list[itemIndex]
      const r1 = rnd()
      const r2 = rnd()
      let kind: Kind
      if (!item.src) kind = 'tag'
      else if (shape === 'mixed') kind = r2 < 0.45 ? 'circle' : r2 < 0.75 ? 'square' : 'card'
      else kind = shape
      const v = Math.max(0, Math.min(1, sizeVariance))
      out.push({ item, itemIndex, kind, factor: 1 + (r1 * 2 - 1) * v * 0.42 })
    }
    return out
  }, [n, list, shape, sizeVariance])

  // Fit: shrink every body so the pile covers at most `fill` of the frame.
  const geos = useMemo<Geo[]>(() => {
    if (!box.w || !box.h) return []
    const raw = specs.map((s) => computeGeo(s, size, 1, radius, frame, frameWidth))
    let area = 0
    raw.forEach((g) => {
      area += g.kind === 'circle' ? (Math.PI * g.w * g.w) / 4 : g.w * g.h
    })
    const maxArea = Math.max(0.02, Math.min(1, fill)) * box.w * box.h
    let scale = area > 0 ? Math.min(1, Math.sqrt(maxArea / area)) : 1
    // Never let a body be wider than the frame.
    const widest = Math.max(...raw.map((g) => Math.max(g.w, g.h)))
    scale = Math.min(scale, (Math.min(box.w, box.h) * 0.9) / Math.max(1, widest))
    return specs.map((s) => computeGeo(s, size, scale, radius, frame, frameWidth))
  }, [specs, box.w, box.h, size, radius, frame, frameWidth, fill])

  // ---------------------------------------------------------------- world
  const worldRef = useRef<World>({
    bodies: [],
    width: 0,
    height: 0,
    gravityX: 0,
    gravityY: 1,
    bounce: 0.32,
    friction: 0.3,
    airFriction: 0.012,
    drift: 0,
    contain: true,
    entryTop: true,
    time: 0,
    held: null,
  })
  const spawnRef = useRef<{ queue: { index: number; at: number }[]; clock: number; rnd: () => number }>({ queue: [], clock: 0, rnd: Math.random })
  const scaleRef = useRef<number[]>([])
  const hoverRef = useRef(-1)
  const focusRef = useRef(-1)
  const labelIdx = useRef(-1)
  const startedRef = useRef(false)
  const visibleRef = useRef(true)
  const rafRef = useRef(0)
  const lastRef = useRef(0)
  const accRef = useRef(0)
  const calmRef = useRef(0)
  const opts = useRef({ paused, hoverScale, spin, entrance, stagger, popForce, throwStrength, dragStiffness, showTitles })
  opts.current = { paused, hoverScale, spin, entrance, stagger, popForce, throwStrength, dragStiffness, showTitles }
  const geosRef = useRef(geos)
  geosRef.current = geos

  // Sync world parameters.
  const w = worldRef.current
  w.width = box.w
  w.height = box.h
  w.gravityX = Math.max(-3, Math.min(3, gravityX))
  w.gravityY = Math.max(-3, Math.min(3, gravity))
  w.bounce = bounce
  w.friction = friction
  w.airFriction = airFriction
  w.drift = drift
  w.contain = contain
  w.entryTop = gravity >= 0

  // Build / rebuild bodies when geometry changes, keeping positions where possible.
  useLayoutEffect(() => {
    if (!geos.length) return
    const world = worldRef.current
    const prev = world.bodies
    const next: Body[] = geos.map((g, i) => {
      const { core, r, area, inertia } = makeCore(g, g.kind === 'square' || g.kind === 'card' ? parseFloat(g.radiusCss) : 0)
      const b = makeBody(core, r, area, inertia)
      const p = prev[i]
      if (p) {
        b.x = p.x
        b.y = p.y
        b.a = p.a
        b.vx = p.vx
        b.vy = p.vy
        b.w = p.w
        b.active = p.active
        b.inside = p.inside
      }
      return b
    })
    world.bodies = next
    scaleRef.current = next.map((_, i) => scaleRef.current[i] ?? 1)
    if (world.held && world.held.index >= next.length) world.held = null
    if (startedRef.current && next.some((b, i) => !b.active && !spawnRef.current.queue.some((q) => q.index === i))) {
      // New bodies (count increased): rain them in.
      const q = spawnRef.current
      next.forEach((b, i) => {
        if (!b.active && !q.queue.some((e) => e.index === i)) q.queue.push({ index: i, at: q.clock + q.queue.length * opts.current.stagger })
      })
    }
    wake()
    render()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geos])

  // ---------------------------------------------------------------- spawning
  const placeForEntry = useCallback((b: Body, i: number, mode: string, rnd: () => number) => {
    const world = worldRef.current
    const W = world.width
    const H = world.height
    const top = world.entryTop
    const sp = opts.current.spin
    b.inside = false
    b.a = (rnd() * 2 - 1) * sp * 0.6
    b.w = (rnd() * 2 - 1) * sp * 3
    const margin = Math.min(b.bound, W / 2)
    if (mode === 'burst') {
      const ang = rnd() * Math.PI * 2
      b.x = W / 2 + Math.cos(ang) * 4
      b.y = H / 2 + Math.sin(ang) * 4
      const speed = 700 + rnd() * 700
      b.vx = Math.cos(ang) * speed
      b.vy = Math.sin(ang) * speed - 250 * Math.sign(world.gravityY || 1)
      b.w = (rnd() * 2 - 1) * sp * 10
      b.inside = true
    } else if (mode === 'drop') {
      const cols = Math.max(1, Math.floor(W / (b.bound * 2.1)))
      const row = Math.floor(i / cols)
      const col = i % cols
      b.x = margin + ((col + 0.5) / cols) * (W - margin * 2) + (rnd() - 0.5) * 20
      const off = b.bound + row * b.bound * 2.2 + rnd() * 30
      b.y = top ? -off : H + off
      b.vx = (rnd() - 0.5) * 40
      b.vy = top ? 120 : -120
    } else {
      b.x = margin + rnd() * Math.max(0, W - margin * 2)
      const off = b.bound + rnd() * H * 0.15
      b.y = top ? -off : H + off
      b.vx = (rnd() - 0.5) * 60
      b.vy = (top ? 1 : -1) * (150 + rnd() * 60)
    }
    b.active = true
  }, [])

  const startEntrance = useCallback(
    (mode: string) => {
      const world = worldRef.current
      if (!world.width || !world.height || !world.bodies.length) return
      startedRef.current = true
      const rnd = mulberry32((performance.now() * 1000) | 0)
      const order = world.bodies.map((_, i) => i)
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1))
        ;[order[i], order[j]] = [order[j], order[i]]
      }
      world.held = null
      world.bodies.forEach((b) => {
        b.active = false
        b.vx = b.vy = b.w = 0
      })
      const q = spawnRef.current
      q.clock = 0
      q.queue = []
      if (mode === 'none') {
        // Settle synchronously so the pile is already resting on first paint.
        order.forEach((i, k) => {
          const b = world.bodies[i]
          placeForEntry(b, k, 'drop', rnd)
          b.y = world.entryTop ? world.height - b.bound - (k % 6) * b.bound * 1.6 - Math.floor(k / 6) * 10 : b.bound + (k % 6) * b.bound * 1.6
          b.inside = true
          b.vy = 0
        })
        for (let s = 0; s < 240 * 4; s++) step(world, 1 / 240)
        world.bodies.forEach((b) => {
          b.vx = b.vy = b.w = 0
        })
      } else if (mode === 'drop') {
        order.forEach((i, k) => placeForEntry(world.bodies[i], k, 'drop', rnd))
      } else {
        const st = mode === 'burst' ? Math.max(0, opts.current.stagger) * 0.3 : Math.max(0, opts.current.stagger)
        order.forEach((i, k) => q.queue.push({ index: i, at: k * st }))
        q.queue.sort((a, b) => a.at - b.at)
        q.rnd = rnd
      }
      wake()
      render()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [placeForEntry],
  )

  // ---------------------------------------------------------------- loop
  const render = useCallback(() => {
    const world = worldRef.current
    const g = geosRef.current
    const o = opts.current
    for (let i = 0; i < world.bodies.length; i++) {
      const el = elRefs.current[i]
      const b = world.bodies[i]
      const geo = g[i]
      if (!el || !geo) continue
      if (!b.active) {
        if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden'
        continue
      }
      if (el.style.visibility !== 'visible') el.style.visibility = 'visible'
      const held = world.held?.index === i
      const hovered = hoverRef.current === i || focusRef.current === i
      const target = held ? o.hoverScale * 1.025 : hovered ? o.hoverScale : 1
      const cur = scaleRef.current[i] ?? 1
      const s = Math.abs(target - cur) < 0.0005 ? target : cur + (target - cur) * 0.22
      scaleRef.current[i] = s
      el.style.transform = `translate3d(${(b.x - geo.w / 2).toFixed(2)}px, ${(b.y - geo.h / 2).toFixed(2)}px, 0px) rotate(${b.a.toFixed(4)}rad)${s !== 1 ? ` scale(${s.toFixed(4)})` : ''}`
    }
    // Title label
    const lab = labelRef.current
    if (lab) {
      const idx = world.held ? world.held.index : hoverRef.current >= 0 ? hoverRef.current : focusRef.current
      const b = idx >= 0 ? world.bodies[idx] : null
      const geo = idx >= 0 ? g[idx] : null
      const show = !!(o.showTitles && b && b.active && geo && geo.kind !== 'chip' && geo.kind !== 'tag' && specsRef.current[idx]?.item.title)
      if (show && b && geo) {
        if (labelIdx.current !== idx) {
          labelIdx.current = idx
          lab.textContent = specsRef.current[idx].item.title ?? ''
        }
        const s = scaleRef.current[idx] ?? 1
        const ext = (Math.abs(Math.cos(b.a)) * geo.h + Math.abs(Math.sin(b.a)) * geo.w) / 2
        const top = b.y - (geo.kind === 'circle' ? geo.w / 2 : ext) * s - 10
        lab.style.transform = `translate3d(${b.x.toFixed(1)}px, ${top.toFixed(1)}px, 0px) translate(-50%, -100%)`
        lab.style.opacity = '1'
      } else {
        lab.style.opacity = '0'
      }
    }
  }, [])

  const specsRef = useRef(specs)
  specsRef.current = specs

  const frame_ = useCallback((now: number) => {
    rafRef.current = 0
    const world = worldRef.current
    const o = opts.current
    const dtMs = Math.min(50, Math.max(0, now - lastRef.current))
    lastRef.current = now
    // Spawning
    const q = spawnRef.current
    if (q.queue.length && !o.paused) {
      q.clock += dtMs
      const rnd = q.rnd
      while (q.queue.length && q.queue[0].at <= q.clock) {
        const e = q.queue.shift()!
        const b = world.bodies[e.index]
        if (b) placeForEntry(b, e.index, o.entrance === 'burst' ? 'burst' : 'rain', rnd)
      }
    }
    if (!o.paused) {
      accRef.current += dtMs / 1000
      const h = 1 / 240
      let steps = 0
      while (accRef.current >= h && steps < 12) {
        step(world, h)
        accRef.current -= h
        steps++
      }
      if (steps >= 12) accRef.current = 0
    } else if (world.held) {
      // Paused: the held body follows the pointer directly.
      const hd = world.held
      const b = world.bodies[hd.index]
      if (b) {
        const c = Math.cos(b.a)
        const s = Math.sin(b.a)
        b.x = hd.tx - (hd.lx * c - hd.ly * s)
        b.y = hd.ty - (hd.lx * s + hd.ly * c)
        b.vx = b.vy = b.w = 0
      }
    }
    render()
    // Sleep when everything is at rest.
    const busy = q.queue.length > 0 || world.held || world.drift !== 0 || scaleRef.current.some((s, i) => {
      const t = world.held?.index === i ? o.hoverScale * 1.025 : hoverRef.current === i || focusRef.current === i ? o.hoverScale : 1
      return Math.abs(s - t) > 0.0005
    })
    const level = o.paused ? 0 : kineticLevel(world)
    if (!busy && level < 25) calmRef.current += dtMs
    else calmRef.current = 0
    if (calmRef.current < 600 && visibleRef.current && !document.hidden) rafRef.current = requestAnimationFrame(frame_)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wake = useCallback(() => {
    calmRef.current = 0
    if (!rafRef.current && visibleRef.current && typeof document !== 'undefined' && !document.hidden) {
      lastRef.current = performance.now()
      rafRef.current = requestAnimationFrame(frame_)
    }
  }, [frame_])

  useEffect(() => {
    wake()
  }, [paused, gravity, gravityX, drift, contain, bounce, friction, airFriction, wake])

  // Size
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const measure = () => setBox((s) => (s.w === el.clientWidth && s.h === el.clientHeight ? s : { w: el.clientWidth, h: el.clientHeight }))
    measure()
    const ro = new ResizeObserver(() => {
      measure()
      wake()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [wake])

  // Visibility + entrance on first view
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const vis = entries[0]?.isIntersecting ?? true
      visibleRef.current = vis
      if (vis) {
        if (!startedRef.current && worldRef.current.width) startEntrance(opts.current.entrance)
        wake()
      }
    })
    io.observe(el)
    const onVis = () => {
      if (!document.hidden) wake()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [startEntrance, wake])

  // Start once the box is measured (if already visible).
  useEffect(() => {
    if (!startedRef.current && box.w && box.h && visibleRef.current && worldRef.current.bodies.length) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      startEntrance(reduced ? 'none' : opts.current.entrance)
    }
  }, [box.w, box.h, geos, startEntrance])

  // ---------------------------------------------------------------- imperative API
  const shake = useCallback(
    (strength = 1) => {
      const world = worldRef.current
      const rnd = Math.random
      const up = world.entryTop ? -1 : 1
      for (const b of world.bodies) {
        if (!b.active) continue
        b.vx += (rnd() * 2 - 1) * 380 * strength
        b.vy += up * (350 + rnd() * 450) * strength
        b.w += (rnd() * 2 - 1) * 6 * strength
      }
      wake()
    },
    [wake],
  )

  const pop = useCallback(
    (x: number, y: number, strength = 1) => {
      const world = worldRef.current
      const reach = Math.max(140, Math.min(world.width, world.height) * 0.35)
      for (const b of world.bodies) {
        if (!b.active) continue
        const dx = b.x - x
        const dy = b.y - y
        const d = Math.hypot(dx, dy)
        if (d > reach + b.bound) continue
        const f = (1 - Math.min(1, Math.max(0, d - b.bound * 0.5) / reach)) * 750 * strength
        const nx = d > 1e-3 ? dx / d : 0
        const ny = d > 1e-3 ? dy / d : -1
        b.vx += nx * f
        b.vy += ny * f - f * 0.35 * (world.entryTop ? 1 : -1)
        b.w += (Math.random() * 2 - 1) * 4 * strength
      }
      wake()
    },
    [wake],
  )

  const hop = useCallback(
    (i: number, strength: number) => {
      const b = worldRef.current.bodies[i]
      if (!b || !b.active || strength <= 0) return
      const up = worldRef.current.entryTop ? -1 : 1
      b.vy += up * 520 * strength
      b.vx += (Math.random() * 2 - 1) * 90 * strength
      b.w += (Math.random() * 2 - 1) * 5 * strength
      wake()
    },
    [wake],
  )

  useImperativeHandle(ref, () => ({ drop: () => startEntrance(opts.current.entrance === 'none' ? 'rain' : opts.current.entrance), shake, pop }), [startEntrance, shake, pop])

  // ---------------------------------------------------------------- pointer
  const ptr = useRef<{ id: number; index: number; sx: number; sy: number; t: number; moved: boolean; lastX: number; lastY: number } | null>(null)
  const suppressClick = useRef(false)

  const localPoint = (e: { clientX: number; clientY: number }) => {
    const r = rootRef.current!.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top] as const
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const [x, y] = localPoint(e)
    const world = worldRef.current
    // Topmost hit (later DOM order paints on top; hovered body is raised).
    let index = -1
    const order = world.bodies.map((_, i) => i)
    if (hoverRef.current >= 0) order.push(hoverRef.current)
    for (let k = order.length - 1; k >= 0; k--) {
      const i = order[k]
      const b = world.bodies[i]
      if (b?.active) {
        const s = scaleRef.current[i] ?? 1
        const lx = b.x + (x - b.x) / s
        const ly = b.y + (y - b.y) / s
        if (hitTest(b, lx, ly)) {
          index = i
          break
        }
      }
    }
    ptr.current = { id: e.pointerId, index, sx: x, sy: y, t: performance.now(), moved: false, lastX: x, lastY: y }
    suppressClick.current = false
    if (index >= 0 && draggable) {
      const b = world.bodies[index]
      const c = Math.cos(-b.a)
      const s = Math.sin(-b.a)
      const dx = x - b.x
      const dy = y - b.y
      world.held = { index, lx: dx * c - dy * s, ly: dx * s + dy * c, tx: x, ty: y, stiffness: Math.max(0, Math.min(1, dragStiffness)) }
      wake()
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = ptr.current
    if (!p || p.id !== e.pointerId) return
    const [x, y] = localPoint(e)
    if (!p.moved && Math.hypot(x - p.sx, y - p.sy) > 6) {
      p.moved = true
      // Capture only once it is a drag, so a plain tap still clicks the photo.
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }
    p.lastX = x
    p.lastY = y
    const held = worldRef.current.held
    if (held) {
      held.tx = x
      held.ty = y
      wake()
    }
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = ptr.current
    if (!p || p.id !== e.pointerId) return
    ptr.current = null
    const world = worldRef.current
    const held = world.held
    if (held) {
      const b = world.bodies[held.index]
      world.held = null
      if (b && p.moved) {
        const k = Math.max(0, throwStrength)
        b.vx *= k
        b.vy *= k
        b.w *= Math.min(1.5, k)
      }
    }
    const tap = !p.moved && performance.now() - p.t < 450
    if (p.moved) suppressClick.current = true
    if (tap && e.type === 'pointerup') {
      if (p.index >= 0) {
        // The button's click handler handles select + hop.
        if (e.pointerType !== 'mouse') {
          hoverRef.current = p.index
          window.setTimeout(() => {
            if (hoverRef.current === p.index) {
              hoverRef.current = -1
              wake()
            }
          }, 1400)
        }
      } else if (popForce > 0) {
        pop(p.sx, p.sy, popForce)
      }
    }
    wake()
  }

  const onBodyKey = (i: number) => (e: ReactKeyboardEvent<HTMLElement>) => {
    const b = worldRef.current.bodies[i]
    if (!b) return
    const k = 320
    let used = true
    if (e.key === 'ArrowLeft') b.vx -= k
    else if (e.key === 'ArrowRight') b.vx += k
    else if (e.key === 'ArrowUp') b.vy -= k * 1.6
    else if (e.key === 'ArrowDown') b.vy += k
    else used = false
    if (used) {
      e.preventDefault()
      b.w += (Math.random() * 2 - 1) * 2
      wake()
    }
  }

  const onBodyClick = (i: number) => (e: { preventDefault: () => void; detail: number }) => {
    if (suppressClick.current) {
      suppressClick.current = false
      e.preventDefault()
      return
    }
    hop(i, popForce)
    const spec = specs[i]
    if (spec) onSelect?.(spec.item, spec.itemIndex)
  }

  // ---------------------------------------------------------------- render
  const k = Math.max(0, Math.min(1, shadow)) / 0.5
  const restShadow =
    shadow > 0
      ? `0 1px 1.5px rgba(0,0,0,${(0.08 * k).toFixed(3)}), 0 4px 8px -2px rgba(0,0,0,${(0.08 * k).toFixed(3)}), 0 12px 26px -8px rgba(0,0,0,${(0.15 * k).toFixed(3)})`
      : 'none'
  const liftShadow =
    shadow > 0 ? `0 22px 40px -12px rgba(0,0,0,${(0.21 * k).toFixed(3)}), 0 8px 16px -6px rgba(0,0,0,${(0.1 * k).toFixed(3)})` : 'none'

  const [active, setActive] = useState(-1) // hovered/held index for styling (shadow, z, colour)
  const [holding, setHolding] = useState(-1)

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={descId}
      className={`relative isolate h-full min-h-[360px] w-full overflow-hidden ${className ?? ''}`}
      style={{ backgroundColor, ...style }}
    >
      <div
        ref={layerRef}
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ touchAction: draggable ? 'none' : 'pan-y' }}
        onPointerDown={(e) => {
          onPointerDown(e)
          const h = worldRef.current.held
          setHolding(h ? h.index : -1)
        }}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => {
          onPointerUp(e)
          setHolding(-1)
        }}
        onPointerCancel={(e) => {
          onPointerUp(e)
          setHolding(-1)
        }}
      >
        {geos.map((g, i) => {
          const spec = specs[i]
          if (!spec) return null
          const item = spec.item
          const isHeld = holding === i
          const isActive = active === i || isHeld
          const label = [item.title, item.alt].filter(Boolean).join(', ') || `Item ${i + 1}`
          const bodyStyle: CSSProperties = {
            position: 'absolute',
            left: 0,
            top: 0,
            width: g.w,
            height: g.h,
            borderRadius: g.radiusCss,
            padding: 0,
            margin: 0,
            border: 0,
            background: 'none',
            color: 'inherit',
            cursor: draggable ? (isHeld ? 'grabbing' : 'grab') : 'pointer',
            touchAction: 'none',
            userSelect: 'none',
            visibility: 'hidden',
            willChange: 'transform',
            boxShadow: g.kind === 'tag' || g.kind === 'chip' ? restShadow : restShadow,
            zIndex: isHeld ? 12 : isActive ? 11 : undefined,
            display: 'block',
            textAlign: 'left',
            WebkitTapHighlightColor: 'transparent',
          }
          const imgFilter = monochrome && !isActive ? 'grayscale(1)' : 'grayscale(0)'
          const inner = (() => {
            if (g.kind === 'tag') {
              return (
                <span
                  className="flex h-full w-full items-center justify-center whitespace-nowrap"
                  style={{ borderRadius: g.innerRadiusCss, background: frameColor, color: textColor, fontSize: g.font, fontWeight: 500, letterSpacing: '-0.01em', pointerEvents: 'none' }}
                >
                  {item.title}
                </span>
              )
            }
            if (g.kind === 'chip') {
              const padL = g.h * 0.12
              return (
                <span
                  className="flex h-full w-full items-center whitespace-nowrap"
                  style={{ borderRadius: '9999px', background: frameColor, color: textColor, fontSize: g.font, fontWeight: 500, paddingLeft: padL, gap: g.h * 0.22, pointerEvents: 'none' }}
                >
                  <span className="block shrink-0 overflow-hidden rounded-full" style={{ width: g.avatar, height: g.avatar, background: 'color-mix(in oklch, currentcolor 10%, transparent)' }}>
                    {item.src ? (
                      <img src={item.src} alt="" draggable={false} className="block h-full w-full object-cover" style={{ filter: imgFilter, transition: 'filter 0.45s' }} />
                    ) : null}
                  </span>
                  <span>{item.title}</span>
                </span>
              )
            }
            const framed = frame !== 'none' && g.pad > 0
            return (
              <span
                className="relative block h-full w-full overflow-hidden"
                style={{
                  borderRadius: g.radiusCss,
                  background: framed ? frameColor : 'color-mix(in oklch, currentcolor 10%, transparent 90%)',
                  padding: framed ? `${g.pad}px ${g.pad}px ${g.kind === 'circle' ? g.pad : g.bottom}px` : 0,
                  pointerEvents: 'none',
                }}
              >
                <span className="relative block h-full w-full overflow-hidden" style={{ borderRadius: framed ? g.innerRadiusCss : g.radiusCss }}>
                  {item.src ? (
                    <img
                      src={item.src}
                      alt=""
                      draggable={false}
                      className="block h-full w-full object-cover"
                      style={{ filter: imgFilter, transition: 'opacity 0.5s, filter 0.45s' }}
                    />
                  ) : null}
                  <span className="absolute inset-0" style={{ borderRadius: 'inherit', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)' }} />
                </span>
                {frame === 'polaroid' && g.kind !== 'circle' && showTitles && item.title ? (
                  <span
                    className="absolute inset-x-0 bottom-0 flex items-center justify-center overflow-hidden whitespace-nowrap"
                    style={{ height: g.bottom, color: textColor, fontSize: g.font, fontWeight: 500, letterSpacing: '-0.01em' }}
                  >
                    {item.title}
                  </span>
                ) : null}
              </span>
            )
          })()
          const common = {
            ref: (el: HTMLElement | null) => {
              elRefs.current[i] = el
            },
            'aria-label': label,
            'aria-describedby': descId,
            draggable: false,
            style: bodyStyle,
            onPointerEnter: (e: ReactPointerEvent<HTMLElement>) => {
              if (e.pointerType !== 'mouse') return
              hoverRef.current = i
              setActive(i)
              wake()
            },
            onPointerLeave: (e: ReactPointerEvent<HTMLElement>) => {
              if (e.pointerType !== 'mouse') return
              if (hoverRef.current === i) hoverRef.current = -1
              setActive((a) => (a === i ? -1 : a))
              wake()
            },
            onFocus: () => {
              focusRef.current = i
              setActive(i)
              wake()
            },
            onBlur: () => {
              if (focusRef.current === i) focusRef.current = -1
              setActive((a) => (a === i ? -1 : a))
              wake()
            },
            onKeyDown: onBodyKey(i),
          }
          const lift = (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ borderRadius: g.radiusCss, boxShadow: liftShadow, opacity: isHeld ? 1 : 0, transition: 'opacity 0.3s', zIndex: -1 }}
            />
          )
          return item.href ? (
            <a key={i} {...common} href={item.href} data-tw-item={i} onClick={(e) => (suppressClick.current ? (suppressClick.current = false, e.preventDefault()) : onSelect?.(item, spec.itemIndex))}>
              {inner}
              {lift}
            </a>
          ) : (
            <button key={i} type="button" {...common} data-tw-item={i} onClick={onBodyClick(i)}>
              {inner}
              {lift}
            </button>
          )
        })}
      </div>
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] whitespace-nowrap"
        style={{
          padding: '5px 9px',
          borderRadius: 8,
          background: frameColor,
          color: textColor,
          fontSize: 12,
          lineHeight: '16px',
          fontWeight: 500,
          letterSpacing: '-0.005em',
          opacity: 0,
          transition: 'opacity 0.18s',
          boxShadow: '0 6px 18px -6px rgba(0,0,0,0.35)',
          willChange: 'transform, opacity',
        }}
      />
      <span id={descId} className="sr-only">
        {draggable ? 'Drag to throw. Arrow keys nudge.' : 'Arrow keys nudge.'}
      </span>
    </div>
  )
}

export default TumbleWall
