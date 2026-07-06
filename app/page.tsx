// /app/page.tsx
import Hero from "@/components/public/Hero";
import Servicios from "@/components/public/Servicios";
import Proyectos from "@/components/public/Proyectos";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Servicios />
      <Proyectos />
    </>
  );
}