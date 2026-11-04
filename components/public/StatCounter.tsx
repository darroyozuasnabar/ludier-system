"use client";

import { useEffect, useState } from "react";

export default function StatCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // Extraemos el número y el sufijo correctamente
  // "10+" -> numericPart = 10, suffix = "+"
  // "95%" -> numericPart = 95, suffix = "%"
  const match = value.match(/(\d+)(.*)/);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, mostramos el valor final de golpe
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(targetNumber);
      setFinished(true);
      return;
    }

    let startTime: number | null = null;
    const duration = 2500; // 2.5 segundos

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing para que frene suavemente al final
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * targetNumber));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetNumber);
        setFinished(true);
      }
    };

    // Pequeño delay para asegurar que el "0" se pinte primero
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetNumber]);

  return (
    <span
      className={`mt-3 inline-block text-2xl font-semibold transition-colors duration-300 ${
        finished ? "text-[#1E2126] group-hover:text-[#FF5A1F]" : "text-[#FF5A1F]"
      }`}
    >
      {count}
      {suffix}
    </span>
  );
}