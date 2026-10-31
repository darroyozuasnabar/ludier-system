import Image from "next/image";
import Link from "next/link";

const modelos = [
  {
    src: "/img/portonCorredizo.jpg",
    alt: "Portón metálico corredizo como modelo de referencia",
    caption: "Ejemplo: Portón corredizo",
  },
  {
    src: "/img/portonModerno.jpg",
    alt: "Portón metálico de estilo moderno como modelo de referencia",
    caption: "Ejemplo: Portón moderno",
  },
  {
    src: "/img/portonResidencial.jpg",
    alt: "Portón metálico residencial como modelo de referencia",
    caption: "Ejemplo: Portón residencial",
  },
  {
    src: "/img/portonesIndustriales.jpg",
    alt: "Portones metálicos industriales como modelos de referencia",
    caption: "Ejemplo: Portón industrial",
  },
];

// FIX GALERIA PORTONES: ejemplos visuales con imágenes optimizadas y CTA atribuido.
export default function GaleriaReferencia() {
  return (
    <section
      aria-labelledby="modelos-referencia"
      className="my-10 min-w-0 rounded-sm border border-[#E3E1D8] bg-white p-5 sm:p-6"
    >
      <h2
        id="modelos-referencia"
        className="text-2xl font-semibold text-[#1E2126] sm:text-3xl"
        style={{ fontFamily: "var(--font-display, Oswald, ui-sans-serif, sans-serif)" }}
      >
        Modelos de referencia
      </h2>
      <p className="mt-3 text-base leading-relaxed text-[#565C63]">
        Explora los estilos que podemos fabricar a tu medida.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {modelos.map(({ src, alt, caption }) => (
          <figure
            key={src}
            className="min-w-0 overflow-hidden rounded-sm border border-[#E3E1D8] bg-[#F7F7F4]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="p-4 text-sm font-semibold text-[#1E2126]">
              {caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <Link
        href="/contacto?from=blog-portones-galeria"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-[#FF5A1F] px-5 py-3 text-center text-sm font-semibold text-[#14161A] transition-colors hover:bg-[#FF7A44] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14161A] sm:w-auto"
      >
        ¿Te gustó un modelo? Cotízalo aquí
      </Link>
    </section>
  );
}
