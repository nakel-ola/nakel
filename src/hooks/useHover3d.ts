import { ForwardedRef, useEffect, useRef, useState } from "react";

type Args = {
  x: number;
  y: number;
  z: number;
};
export const useHover3d = (args: Args = { z: 0, x: 0, y: 0 }) => {
  const { x = 0, y = 0, z = 0 } = args;
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const { offsetWidth: width, offsetHeight: height } = ref.current;
    const { clientX, clientY } = e;

    const x = (clientX - width / 2) / width;
    const y = (clientY - height / 2) / height;

    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    if (!ref.current) return;

    const { current } = ref;

    current.addEventListener("mousemove", handleMouseMove);
    current.addEventListener("mouseenter", handleMouseEnter);
    current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      current.removeEventListener("mousemove", handleMouseMove);
      current.removeEventListener("mouseenter", handleMouseEnter);
      current.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  const { x: xCoord, y: yCoord } = coords;

  const xTransform = isHovering ? xCoord * x : 0;
  const yTransform = isHovering ? yCoord * y : 0;
  const zTransform = isHovering ? z : 0;

  const transform = `perspective(5000px) rotateX(${xTransform}deg) rotateY(${yTransform}deg) translateZ(${zTransform}px)`;

  const transition = isHovering ? `transform 0.1s ease-out` : "";

  return { ref, transition, transform };
};
