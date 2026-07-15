import Hero from "@/components/public/Hero";
import Servicios from "@/components/public/Servicios";
import Beneficios from "@/components/public/Beneficios";
import Proyectos from "@/components/public/Proyectos";
import Clientes from "@/components/public/Clientes";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Servicios />
      <Beneficios />
      <Proyectos limit={3} isHome={true} />
      <Clientes />
    </>
  );
}