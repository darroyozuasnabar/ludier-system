import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ServicioCatalogo } from "@/lib/servicios-catalogo";

export default function ServicioCard({ servicio }: { servicio: ServicioCatalogo }) {
  const Icon = servicio.icon;
  const links = servicio.relatedLinks.length > 0
    ? servicio.relatedLinks
    : [{
        label: "Solicitar cotización",
        href: `/contacto?servicio=${encodeURIComponent(servicio.title)}&from=catalogo-servicios`,
      }];

  return (
    <article className="ludier-service-card group relative flex h-full flex-col overflow-hidden rounded-sm border border-[var(--ludier-border)] bg-[var(--ludier-surface)]">
      <span aria-hidden className="pointer-events-none absolute inset-2 z-10">
        <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-white/60 group-hover:border-[var(--ludier-accent)]" />
        <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-white/60 group-hover:border-[var(--ludier-accent)]" />
        <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[var(--ludier-border-muted)] group-hover:border-[var(--ludier-accent)]" />
        <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[var(--ludier-border-muted)] group-hover:border-[var(--ludier-accent)]" />
      </span>
      <Link
        href={servicio.href}
        className="relative flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ludier-accent)]"
      >
        <div className="ludier-card-image relative h-44 shrink-0 overflow-hidden border-b border-[var(--ludier-border)] bg-[var(--ludier-paper)]">
          <Image
            src={servicio.image}
            alt={servicio.imageAlt}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <span className="rounded-sm bg-[#1E2126]/75 px-2 py-1 font-mono text-xs tracking-wider text-white">
              {servicio.code}
            </span>
            <span className="rounded-sm bg-[#1E2126]/75 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
              {servicio.tag}
            </span>
          </div>
          <span className="ludier-card-open" aria-hidden><ArrowUpRight className="h-5 w-5" /></span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex min-h-14 items-start gap-4">
            <span className="ludier-card-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[var(--ludier-border)] bg-[var(--ludier-paper)]">
              <Icon className="h-4 w-4 text-[#3F454C]" aria-hidden />
            </span>
            <h3 className="pt-1 text-lg font-semibold leading-7 text-[var(--ludier-title)]">
              {servicio.title}
            </h3>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-[var(--ludier-text)]">
            {servicio.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--ludier-accent-ink)]">
            {servicio.linkLabel}
            <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden />
          </span>
        </div>
      </Link>
      <div className="flex min-h-[4.5rem] items-center border-t border-[var(--ludier-border)] bg-[var(--ludier-paper)] px-6 py-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center gap-2 text-xs font-medium leading-relaxed text-[var(--ludier-text)] underline-offset-4 hover:text-[var(--ludier-accent-ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ludier-accent)]"
          >
            {link.label}
            <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </Link>
        ))}
      </div>
      <span aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 h-0.5 origin-left scale-x-0 bg-[var(--ludier-accent)] transition-transform group-hover:scale-x-100 motion-reduce:transition-none" />
    </article>
  );
}
