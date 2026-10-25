import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export type CustomCursorProps = {
  /** Size of the outer circle in pixels. */
  circleSize?: number
  /** Size of the inner dot in pixels. */
  dotSize?: number
  /** Color of the outer circle (any valid CSS color). */
  circleColor?: string
  /** Color of the inner dot (any valid CSS color). */
  dotColor?: string
  /** Spring stiffness for the outer circle (higher = faster). */
  circleStiffness?: number
  /** Spring damping for the outer circle (higher = less bounce). */
  circleDamping?: number
  /** Spring stiffness for the inner dot (higher = faster). */
  dotStiffness?: number
  /** Spring damping for the inner dot (higher = less bounce). */
  dotDamping?: number
  /** Border width of the outer circle in pixels. */
  circleBorderWidth?: number
  /** Additional class name for the container. */
  className?: string
  /** Additional class name for the circle. */
  circleClassName?: string
  /** Additional class name for the dot. */
  dotClassName?: string
  /** Whether to show the cursor on touch devices. */
  showOnTouch?: boolean
  /** Z-index of the cursor. */
  zIndex?: number
  /** Enable subtle elastic stretch in direction of movement. */
  elastic?: boolean
  /** Additional class name for the image elements. */
  imageClassName?: string
  /** Padding between cursor and target in pixels. */
  targetPadding?: number
  /** CSS selectors for target elements to trigger effects on hover. */
  targets?: string[]
  /** Image URLs corresponding to each target (targets without images still morph the cursor). */
  images?: (string | undefined)[]
  /** Scale amount for images when hovering targets (0-1). */
  imageScale?: number
  /** Duration of image scale animation in seconds. */
  imageAnimationDuration?: number
  /** Mix blend mode for the cursor elements. */
  mixBlendMode?: string
  /** Custom content to render inside the cursor. */
  children?: ReactNode
}

type Spring = { x: number; v: number; t: number }
const spring = (x: number): Spring => ({ x, v: 0, t: x })

// Semi-implicit Euler with fixed sub-steps; mass = 1.
function stepSpring(s: Spring, k: number, c: number, dt: number) {
  const a = -k * (s.x - s.t) - c * s.v
  s.v += a * dt
  s.x += s.v * dt
}
const settled = (s: Spring, eps = 0.05) => Math.abs(s.x - s.t) < eps && Math.abs(s.v) < eps * 10

let scopeCounter = 0

export function CustomCursor({
  circleSize = 40,
  dotSize = 6,
  circleColor = 'rgb(0, 0, 0)',
  dotColor = 'rgb(0, 0, 0)',
  circleStiffness = 150,
  circleDamping = 20,
  dotStiffness = 300,
  dotDamping = 30,
  circleBorderWidth = 2,
  className = '',
  circleClassName = '',
  dotClassName = '',
  showOnTouch = false,
  zIndex = 9999,
  elastic = false,
  imageClassName = '',
  targetPadding = 0,
  targets = [],
  images = [],
  imageScale = 0.9,
  imageAnimationDuration = 0.6,
  mixBlendMode,
  children,
}: CustomCursorProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cfg = { circleSize, dotSize, circleStiffness, circleDamping, dotStiffness, dotDamping, showOnTouch, elastic, targetPadding, targets, images, imageScale, imageAnimationDuration }
  const cfgRef = useRef(cfg)
  cfgRef.current = cfg
  const kickRef = useRef<() => void>(() => {})

  const targetsKey = targets.join('\u0000')
  useEffect(() => {
    kickRef.current()
  }, [circleSize, dotSize, circleStiffness, circleDamping, dotStiffness, dotDamping, elastic, targetPadding, targetsKey])

  useEffect(() => {
    const layer = layerRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const media = mediaRef.current
    const img = imgRef.current
    const content = contentRef.current
    const scope = layer?.parentElement
    if (!layer || !ring || !dot || !media || !img || !content || !scope) return

    // Hide the native cursor only inside the area we cover.
    const scopeId = `cc-${++scopeCounter}`
    scope.setAttribute('data-custom-cursor-scope', scopeId)
    const styleEl = document.createElement('style')
    styleEl.textContent = `[data-custom-cursor-scope="${scopeId}"], [data-custom-cursor-scope="${scopeId}"] * { cursor: none !important; }`
    document.head.appendChild(styleEl)
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)')

    const c0 = cfgRef.current
    const st = {
      rx: spring(0), ry: spring(0), rw: spring(c0.circleSize), rh: spring(c0.circleSize), rr: spring(c0.circleSize / 2),
      dx: spring(0), dy: spring(0),
      px: 0, py: 0, // pointer in layer px
      visible: false,
      hidden: true, // true until first move
      hover: null as Element | null,
      hoverIndex: -1,
      imgT: 0, // 0..1 image reveal progress
      vx: 0, vy: 0,
    }

    const findTarget = (el: Element | null): [Element | null, number] => {
      const sels = cfgRef.current.targets
      if (!el || !sels.length) return [null, -1]
      for (let i = 0; i < sels.length; i++) {
        let hit: Element | null = null
        try {
          hit = el.closest(sels[i])
        } catch {
          hit = null
        }
        if (hit && scope.contains(hit)) return [hit, i]
      }
      return [null, -1]
    }

    const radiusOf = (el: Element, w: number, h: number) => {
      const cs = getComputedStyle(el)
      const raw = cs.borderTopLeftRadius
      const n = parseFloat(raw)
      if (!Number.isFinite(n)) return 0
      const r = raw.includes('%') ? (n / 100) * Math.min(w, h) : n
      return Math.min(r, Math.min(w, h) / 2)
    }

    const retarget = () => {
      const c = cfgRef.current
      const lr = layer.getBoundingClientRect()
      if (st.hover) {
        const r = st.hover.getBoundingClientRect()
        const pad = c.targetPadding
        const w = r.width + pad * 2, h = r.height + pad * 2
        st.rx.t = r.left - lr.left + r.width / 2
        st.ry.t = r.top - lr.top + r.height / 2
        st.rw.t = w
        st.rh.t = h
        st.rr.t = radiusOf(st.hover, r.width, r.height) + (pad > 0 ? pad : 0)
      } else {
        st.rx.t = st.px
        st.ry.t = st.py
        st.rw.t = c.circleSize
        st.rh.t = c.circleSize
        st.rr.t = c.circleSize / 2
      }
      st.dx.t = st.px
      st.dy.t = st.py
    }

    const jumpAll = () => {
      for (const s of [st.rx, st.ry, st.rw, st.rh, st.rr, st.dx, st.dy]) {
        s.x = s.t
        s.v = 0
      }
    }

    let raf = 0, last = 0
    const frame = (now: number) => {
      raf = 0
      const c = cfgRef.current
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      retarget()
      const reduced = reduceMQ.matches
      if (reduced) jumpAll()
      else {
        const sub = Math.max(1, Math.ceil(dt / (1 / 240)))
        const h = dt / sub
        for (let i = 0; i < sub; i++) {
          for (const s of [st.rx, st.ry, st.rw, st.rh, st.rr]) stepSpring(s, c.circleStiffness, c.circleDamping, h)
          stepSpring(st.dx, c.dotStiffness, c.dotDamping, h)
          stepSpring(st.dy, c.dotStiffness, c.dotDamping, h)
        }
      }
      // image reveal
      const wantImg = st.hover && c.images[st.hoverIndex] ? 1 : 0
      const dur = Math.max(0.01, c.imageAnimationDuration)
      if (reduced) st.imgT = wantImg
      else if (st.imgT < wantImg) st.imgT = Math.min(1, st.imgT + dt / dur)
      else if (st.imgT > wantImg) st.imgT = Math.max(0, st.imgT - dt / (dur * 0.2))

      // render
      const w = Math.max(0, st.rw.x), h = Math.max(0, st.rh.x)
      let stretch = ''
      if (c.elastic && !st.hover && !reduced) {
        const sp = Math.hypot(st.rx.v, st.ry.v)
        const k = Math.min(0.25, sp / 4000)
        if (k > 0.005) {
          const ang = Math.atan2(st.ry.v, st.rx.v)
          stretch = ` rotate(${ang}rad) scale(${1 + k}, ${1 - k * 0.7}) rotate(${-ang}rad)`
        }
      }
      ring.style.width = `${w}px`
      ring.style.height = `${h}px`
      ring.style.borderRadius = `${Math.max(0, st.rr.x)}px`
      ring.style.transform = `translate3d(${st.rx.x - w / 2}px, ${st.ry.x - h / 2}px, 0)${stretch}`
      dot.style.transform = `translate3d(${st.dx.x - c.dotSize / 2}px, ${st.dy.x - c.dotSize / 2}px, 0) scale(${st.hover ? 0 : 1})`
      const op = st.visible && !st.hidden ? '1' : '0'
      ring.style.opacity = op
      dot.style.opacity = op
      content.style.opacity = st.hover ? '0' : '1'

      const e = 1 - Math.pow(1 - st.imgT, 3)
      media.style.opacity = String(Math.min(1, st.imgT * 3))
      img.style.transform = `scale(${(0.75 + 0.25 * e) * c.imageScale})`
      img.style.opacity = String(e)
      img.style.borderRadius = `${Math.max(0, st.rr.x) * c.imageScale}px`
      media.style.borderRadius = `${Math.max(0, st.rr.x)}px`

      const busy =
        !(settled(st.rx) && settled(st.ry) && settled(st.rw) && settled(st.rh) && settled(st.rr) && settled(st.dx) && settled(st.dy)) ||
        st.imgT !== wantImg
      if (busy) raf = requestAnimationFrame(frame)
      else last = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    kickRef.current = kick

    const setImage = () => {
      const src = st.hover ? cfgRef.current.images[st.hoverIndex] : undefined
      if (src && img.getAttribute('src') !== src) img.src = src
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && !cfgRef.current.showOnTouch) {
        st.visible = false
        kick()
        return
      }
      const lr = layer.getBoundingClientRect()
      st.px = e.clientX - lr.left
      st.py = e.clientY - lr.top
      const [hit, idx] = findTarget(e.target as Element | null)
      if (hit !== st.hover) {
        st.hover = hit
        st.hoverIndex = idx
        setImage()
      }
      if (st.hidden || !st.visible) {
        // appear in place, no fly-in from the corner
        st.hidden = false
        st.visible = true
        retarget()
        if (!hit) jumpAll()
        else {
          st.dx.x = st.px
          st.dy.x = st.py
        }
      }
      kick()
    }
    const onLeave = () => {
      st.visible = false
      st.hover = null
      st.hoverIndex = -1
      kick()
    }
    const onScroll = () => {
      if (st.visible) kick()
    }
    scope.addEventListener('pointermove', onMove)
    scope.addEventListener('pointerdown', onMove)
    scope.addEventListener('pointerleave', onLeave)
    scope.addEventListener('pointercancel', onLeave)
    window.addEventListener('scroll', onScroll, true)
    const ro = new ResizeObserver(() => kick())
    ro.observe(scope)
    kick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      scope.removeEventListener('pointermove', onMove)
      scope.removeEventListener('pointerdown', onMove)
      scope.removeEventListener('pointerleave', onLeave)
      scope.removeEventListener('pointercancel', onLeave)
      window.removeEventListener('scroll', onScroll, true)
      if (scope.getAttribute('data-custom-cursor-scope') === scopeId) scope.removeAttribute('data-custom-cursor-scope')
      styleEl.remove()
      kickRef.current = () => {}
    }
  }, [])

  const blend = mixBlendMode as CSSProperties['mixBlendMode']
  return (
    <div
      ref={layerRef}
      className={className}
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex, overflow: 'hidden' }}
    >
      <div
        ref={ringRef}
        className={circleClassName}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: circleSize,
          height: circleSize,
          border: `${circleBorderWidth}px solid ${circleColor}`,
          borderRadius: circleSize / 2,
          boxSizing: 'border-box',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          mixBlendMode: blend,
          willChange: 'transform, width, height',
        }}
      >
        <div
          ref={mediaRef}
          style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'rgba(0,0,0,0.92)', opacity: 0 }}
        >
          <img
            ref={imgRef}
            alt=""
            draggable={false}
            className={imageClassName}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}
          />
        </div>
        <div
          ref={contentRef}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s ease' }}
        >
          {children}
        </div>
      </div>
      <div
        ref={dotRef}
        className={dotClassName}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: dotColor,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          mixBlendMode: blend,
          willChange: 'transform',
        }}
      />
    </div>
  )
}

export default CustomCursor
