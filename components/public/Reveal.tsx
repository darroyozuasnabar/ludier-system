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
    const el = ref.current;
    if (!el) return;

    // Respetar movimiento reducido
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
      return;
    }

    // Estado inicial
    el.style.opacity = "0";
    el.style.transform = "translateY(50px) scale(0.95)";
    el.style.filter = "blur(10px)";
    el.style.transition = `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)";
          el.style.filter = "blur(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
}