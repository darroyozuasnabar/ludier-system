"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 2500;

export default function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // Capturas independientes: "10+" -> ["10", "+"], "95%" -> ["95", "%"].
  const match = value.trim().match(/^(\d+)(\D*)$/);
  const targetNumber = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? "";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;
    let observer: IntersectionObserver | undefined;
    let started = false;
    let startTime: number | undefined;

    const finish = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer?.disconnect();
      setCount(targetNumber);
      setFinished(true);
    };

    const animate = (timestamp: number) => {
      startTime ??= timestamp;
      const progress = Math.min((timestamp - startTime) / DURATION, 1);

      // Un avance uniforme mantiene el conteo visible durante los 2,5 segundos.
      setCount(Math.floor(progress * targetNumber));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        finish();
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      if (motion.matches || targetNumber === 0) {
        finish();
        return;
      }
      frame = requestAnimationFrame(animate);
    };

    const updateMotion = () => {
      if (motion.matches) finish();
    };

    if (motion.matches || targetNumber === 0) {
      finish();
    } else {
      setCount(0);
      setFinished(false);
      const bounds = element.getBoundingClientRect();
      const visible = bounds.top < window.innerHeight && bounds.bottom > 0
        && bounds.left < window.innerWidth && bounds.right > 0;

      if (visible || !window.IntersectionObserver) {
        start();
      } else {
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) start();
        }, { threshold: 0.1 });
        observer.observe(element);
      }
    }

    motion.addEventListener("change", updateMotion);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer?.disconnect();
      motion.removeEventListener("change", updateMotion);
    };
  }, [targetNumber]);

  return (
    <span
      ref={ref}
      style={{ fontFamily: "var(--font-display)" }}
      className={`mt-3 inline-block text-2xl font-semibold tabular-nums transition-colors duration-300 motion-reduce:transition-none ${
        finished ? "text-[#1E2126] group-hover:text-[#FF5A1F]" : "text-[#FF5A1F]"
      }`}
    >
      {match ? `${count}${suffix}` : value}
    </span>
  );
}
