import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronDown, PhoneCall } from "lucide-react";
import Reveal from "@/components/public/Reveal";
import ScrollToLink from "@/components/public/ScrollToLink";
import ServiciosShowcase from "@/components/public/ServiciosShowcase";

export default function ServiciosHero() {
  return (
    <section className="ludier-services-hero relative overflow-hidden bg-[#14161A] pb-16 pt-28 lg:pb-24 lg:pt-36">
      <div className="ludier-services-grid" aria-hidden />
      <div className="ludier-services-glow" aria-hidden />
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[#FF5A1F]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="ludier-eyebrow text-[#C7CBD1]">
              <span className="h-px w-6 bg-[#FF5A1F]" aria-hidden />
              Nuestros servicios · Lima, Perú
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
              Servicios de<br />{" "}
              <span className="text-[#FF5A1F]">metalmecánica</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#B4B9BF] sm:text-lg">
              Fabricamos e instalamos estructuras, barandas, escaleras, portones
              y chutes metálicos en Lima. Tú defines el proyecto; nosotros lo
              llevamos del plano a la obra.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/contacto" className="ludier-button ludier-button-primary">
                <PhoneCall className="h-4 w-4" aria-hidden /> Cotizar ahora
              </Link>
              <Link href="/servicios/empresas-estructuras-metalicas" className="ludier-button ludier-button-secondary ludier-button-secondary-dark">
                Soy constructora <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#9AA0A6]">
              {["Más de 10 años de experiencia", "Fabricación según planos", "Montaje en obra"].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#FF5A1F]" aria-hidden /> {text}
                </span>
              ))}
            </div>
            <ScrollToLink targetId="catalogo-servicios" className="ludier-explore-link mt-9 inline-flex min-h-11 items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-[#C7CBD1]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3A3F45]" aria-hidden><ChevronDown className="h-4 w-4" /></span>
              Explorar servicios
            </ScrollToLink>
          </Reveal>
          <Reveal delay={120}>
            <ServiciosShowcase />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
