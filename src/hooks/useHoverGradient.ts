import { useCallback, useEffect, useRef } from "react";

export const useHoverGradient = () => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;

    const width = ref.current?.offsetWidth ?? 0;
    const height = ref.current?.offsetHeight ?? 0;

    let x = Math.round((e.pageX / width) * 100);
    let y = Math.round((e.pageY / height) * 100);

    const deg = (x + y) % 360;

    ref.current!.style.background = `linear-gradient(${deg}deg, hsla(159, 82%, 55%, 1) 0%, hsla(206, 98%, 48%, 1) 100%)`;
    // ref.current!.style.background = `radial-gradient(at ${x}% ${y}%, transparent, rgba(255,255,255,0.1))`;
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const { current } = ref;

    current.addEventListener("mousemove", handleMouseMove);

    return () => {
      current.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);
  return ref;
};
