import type { Metadata } from "next";

// FIX MOBILE F2B: destino público para el enlace legal, sin competir en búsquedas.
export const metadata: Metadata = {
  title: "Términos de servicio",
  description: "Condiciones informativas del sitio web y las cotizaciones de LUDIER.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <section className="bg-[#F7F7F4] px-4 pb-16 pt-24 text-[#1E2126] md:pt-28">
      <article className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed">
        <h1 className="text-3xl font-semibold sm:text-4xl">Términos de servicio</h1>
        <p>
          El contenido de este sitio es informativo y presenta los servicios y
          proyectos de LUDIER.
        </p>
        <p>
          Las cotizaciones están sujetas a evaluación técnica. El alcance, los
          materiales, los plazos y las condiciones se determinan para cada proyecto.
        </p>
        <p>
          Los proyectos ejecutados se rigen por un contrato independiente. El envío
          de una consulta mediante este sitio no constituye la contratación de un
          servicio.
        </p>
      </article>
    </section>
  );
}
