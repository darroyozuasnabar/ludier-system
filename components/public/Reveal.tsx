"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (motion.matches) return;
      animation = element.animate(
        [
          { opacity: 0, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 650, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
      );
    }, { threshold: 0.08 });

    const stop = () => { if (motion.matches) animation?.cancel(); };
    motion.addEventListener("change", stop);
    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
      motion.removeEventListener("change", stop);
    };
  }, [delay]);

  // El contenido permanece visible sin JavaScript; la entrada es una mejora visual.
  return <div ref={ref} className={className}>{children}</div>;
}
