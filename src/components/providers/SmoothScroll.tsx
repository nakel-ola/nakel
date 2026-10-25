import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import Lenis from "lenis";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ScrollApi = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  lock: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollApi>({
  lenis: null,
  scrollTo: () => {},
  lock: () => {},
});

export const useSmoothScroll = () => useContext(ScrollContext);

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const lockCount = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (lockCount.current > 0) instance.stop();
    lenisRef.current = instance;
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback<ScrollApi["scrollTo"]>(
    (target, offset = 0) => {
      const instance = lenisRef.current;
      if (instance) {
        instance.scrollTo(target, { offset, duration: 1.4 });
        return;
      }
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (typeof el === "number") window.scrollTo({ top: el });
      else if (el instanceof HTMLElement)
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
    },
    []
  );

  const lock = useCallback(
    (locked: boolean) => {
      lockCount.current = Math.max(0, lockCount.current + (locked ? 1 : -1));
      const stopped = lockCount.current > 0;
      const instance = lenisRef.current;
      if (instance) {
        if (stopped) instance.stop();
        else instance.start();
      }
      document.documentElement.style.overflow = stopped ? "hidden" : "";
    },
    []
  );

  return (
    <ScrollContext.Provider value={{ lenis, scrollTo, lock }}>
      {children}
    </ScrollContext.Provider>
  );
};
