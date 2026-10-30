import Link from "next/link";
import { ArrowRight, Calendar, ChevronRight, FileCheck, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const FONT_DISPLAY = "var(--font-display, Oswald, ui-sans-serif, sans-serif)";
const FONT_BODY = "var(--font-body, Inter, ui-sans-serif, system-ui, sans-serif)";
const FONT_MONO = 'var(--font-mono, "JetBrains Mono", ui-monospace, monospace)';

type LegalSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  content: ReactNode;
};

// FIX LEGAL DESIGN: patrón compartido de hero oscuro, lectura por secciones y CTA.
export default function LegalPageLayout({
  title,
  subtitle,
  sections,
  contactTitle,
}: {
  title: string;
  subtitle: string;
  sections: LegalSection[];
  contactTitle: string;
}) {
  return (
    <div className="bg-[#F7F7F4] text-[#1E2126]" style={{ fontFamily: FONT_BODY }}>
      <section className="relative overflow-hidden bg-[#14161A] pb-16 pt-28 text-white md:pt-32 lg:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[#FF5A1F]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <nav aria-label="Migas de pan" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#B4B9BF]">
              <li>
                <Link href="/" className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]">
                  Inicio
                </Link>
              </li>
              <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
              <li aria-current="page" className="min-w-0 break-words">{title}</li>
            </ol>
          </nav>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#FF5A1F]" style={{ fontFamily: FONT_MONO }}>
            <FileCheck className="h-4 w-4 shrink-0" aria-hidden />
            Documento legal
          </p>
          <h1 className="mt-5 break-words text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: FONT_DISPLAY }}>
            {title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-[#B4B9BF]">{subtitle}</p>
          <p className="mt-7 flex flex-wrap items-center gap-2 text-sm text-[#B4B9BF]">
            <Calendar className="h-4 w-4 shrink-0 text-[#FF5A1F]" aria-hidden />
            <span>Última actualización: <time dateTime="2026-10-30">30 de octubre de 2026</time></span>
          </p>
        </div>
      </section>

      <article aria-label={title} className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
        {sections.map(({ id, title: sectionTitle, icon: Icon, content }, index) => (
          <section key={id} aria-labelledby={id} className="scroll-mt-24 border border-[#E3E1D8] bg-white p-5 sm:p-8">
            <div className="mb-5 flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 text-[#FF5A1F]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 id={id} className="min-w-0 self-center break-words text-xl font-semibold leading-snug sm:text-2xl" style={{ fontFamily: FONT_DISPLAY }}>
                <span className="mr-2 text-[#FF5A1F]">{String(index + 1).padStart(2, "0")}.</span>
                {sectionTitle}
              </h2>
            </div>
            <div className="max-w-[65ch] space-y-4 break-words text-base leading-relaxed text-[#565C63]">
              {content}
            </div>
          </section>
        ))}
      </article>

      <section className="border-t border-[#E3E1D8] bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl border-l-4 border-[#FF5A1F] bg-[#F7F7F4] p-6 sm:p-8">
          <h2 className="text-balance text-2xl font-semibold sm:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>{contactTitle}</h2>
          <Link href="/contacto" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-[#14161A] transition-colors hover:bg-[#FF7A44] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14161A]">
            Escríbenos
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
