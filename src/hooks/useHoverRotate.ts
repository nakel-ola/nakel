import { useCallback, useEffect, useRef, useState } from "react";

export const useHoverRotate = () => {
  const [degree, setDegree] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;

    // Convert radians to degrees

    const centerX = ref.current.offsetWidth / 2;
    const centerY = ref.current?.offsetHeight / 2;

    const angle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    ) as number;

    const degrees = (angle * 360) / Math.PI;
    setDegree(degrees);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const { current } = ref;

    current.addEventListener("mousemove", handleMouseMove);

    return () => {
      current.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return { ref, degree };
};
