"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const numericPart = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/\D/g, "");

  useEffect(() => {
    // Respetar preferencia de movimiento reducido
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(numericPart);
      setFinished(true);
      return;
    }

    // Forzar un delay de 100ms para que el navegador pinte el "0" inicial
    const delayTimer = setTimeout(() => {
      setStarted(true);
    }, 100);

    return () => clearTimeout(delayTimer);
  }, [numericPart]);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    const duration = 2500; // 2.5 segundos, tiempo suficiente para apreciarlo

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
      className={`mt-3 inline-block text-2xl font-semibold transition-all duration-300 ${
        finished
          ? "scale-100 text-[#1E2126] group-hover:text-[#FF5A1F]"
          : "scale-100 text-[#FF5A1F]"
      }`}
    >
      {count}{suffix}
    </span>
  );
}