"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const numericPart = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/\d/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    // Respetar preferencia de movimiento reducido
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(numericPart);
      setFinished(true);
      return;
    }

    let startTime: number | null = null;
    const duration = 3000; // 3 segundos: tiempo suficiente para apreciarlo

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing: arranca suave, acelera y frena al final
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * numericPart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericPart);
        setFinished(true);
      }
    };
    requestAnimationFrame(animate);
  }, [started, numericPart]);

  return (
    <span
      ref={ref}
      className={`mt-3 inline-block text-2xl font-semibold text-[#1E2126] transition-all duration-500 ${
        finished 
          ? "scale-100 group-hover:text-[#FF5A1F]" 
          : "scale-95 text-[#FF5A1F]"
      }`}
    >
      {count}{suffix}
    </span>
  );
}