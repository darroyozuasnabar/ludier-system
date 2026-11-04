"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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
      return;
    }

    setIsAnimating(true);
    let startTime: number | null = null;
    const duration = 2000; // 2 segundos para que se sienta más épico

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Función de easing: arranca lento, acelera y frena suave al final
      const easeInOutQuart = progress < 0.5 
        ? 8 * progress * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;
        
      setCount(Math.floor(easeInOutQuart * numericPart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false); // Termina la animación cuando llega al final
      }
    };
    requestAnimationFrame(animate);
  }, [started, numericPart]);

  return (
    <span
      ref={ref}
      className={`mt-3 inline-block text-3xl font-bold text-[#1E2126] transition-all duration-300 ${
        isAnimating 
          ? "scale-110 text-[#FF5A1F] blur-[0.5px]" 
          : "scale-100 group-hover:text-[#FF5A1F]"
      }`}
    >
      {count}{suffix}
    </span>
  );
}