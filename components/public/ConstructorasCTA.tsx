import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ConstructorasCTA() {
  return (
    <section
      aria-labelledby="constructoras-titulo"
      className="relative overflow-hidden rounded-sm border border-[var(--ludier-border)] bg-[var(--ludier-surface)]"
    >
      <div className="grid lg:grid-cols-5">
        <div className="relative min-h-60 bg-[#14161A] lg:col-span-2">
          <Image
            src="/img/proyectos/qantua/28-vistaIntegralQantuaF1&F2.jpeg"
            alt="Vista del proyecto Qantua, donde LUDIER ejecutó barandas, estructuras complementarias, cerramientos y chutes"
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 text-xs leading-relaxed text-white">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-white/80">Obra ejecutada · Grupo LAR</span>
            <span className="block text-sm font-semibold">Proyecto Qantua</span>
            Barandas, estructuras complementarias, cerramientos y chutes.
          </p>
        </div>
        <div className="p-6 sm:p-8 lg:col-span-3 lg:p-10">
          <p className="ludier-eyebrow text-[var(--ludier-text)]">
            <span className="h-px w-6 shrink-0 bg-[var(--ludier-accent)]" aria-hidden />
            Atención a constructoras
          </p>
          <h2
            id="constructoras-titulo"
            className="mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-[var(--ludier-title)] sm:text-3xl"
          >
            Metalmecánica para las etapas de tu obra
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#565C63] sm:text-base">
            Cotiza varios alcances con un solo equipo: fabricación según planos,
            suministro y montaje coordinado con el avance de tu proyecto en Lima.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-[#3F454C]">
            {[
              "Homologación por Hodelpe para trabajar con Grupo LAR.",
              "Experiencia documentada en Qantua, Zendai y Catalina Tower.",
              "Revisión de planos, metrados y plazos para definir tu cotización.",
            ].map((text) => (
              <li key={text} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ludier-accent)]" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/contacto?servicio=Metalmec%C3%A1nica%20para%20constructoras&from=servicios-constructoras"
              className="ludier-button ludier-button-primary"
            >
              Cotizar mi obra
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <Link
              href="/servicios/empresas-estructuras-metalicas"
              className="ludier-button ludier-button-secondary"
            >
              Ver capacidades y obras
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
