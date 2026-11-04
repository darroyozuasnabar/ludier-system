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
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let animation: Animation | undefined;
    let observer: IntersectionObserver | undefined;
    let revealed = false;

    const reveal = () => {
      if (revealed || motion.matches) return;
      revealed = true;
      observer?.disconnect();
      animation = element.animate(
        [
          { opacity: 0, transform: "translateY(60px) scale(0.9)", filter: "blur(10px)" },
          { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
        ],
        { duration: 1000, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
      );
    };

    const bounds = element.getBoundingClientRect();
    const visible = bounds.width > 0 && bounds.height > 0
      && bounds.top < window.innerHeight && bounds.bottom > 0
      && bounds.left < window.innerWidth && bounds.right > 0;

    if (visible) {
      reveal();
    } else if (window.IntersectionObserver) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) reveal();
      }, { threshold: 0.08 });
      observer.observe(element);
    }

    const stop = () => {
      if (!motion.matches) return;
      observer?.disconnect();
      animation?.cancel();
    };
    motion.addEventListener("change", stop);
    return () => {
      observer?.disconnect();
      animation?.cancel();
      motion.removeEventListener("change", stop);
    };
  }, [delay]);

  // El contenido permanece visible sin JavaScript; la entrada es una mejora visual.
  return <div ref={ref} className={className}>{children}</div>;
}
