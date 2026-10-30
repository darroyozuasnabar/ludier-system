import type { Metadata } from "next";

// FIX MOBILE F2B: destino público para el enlace legal, sin competir en búsquedas.
export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre el uso de los datos del formulario de contacto de LUDIER.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <section className="bg-[#F7F7F4] px-4 pb-16 pt-24 text-[#1E2126] md:pt-28">
      <article className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed">
        <h1 className="text-3xl font-semibold sm:text-4xl">Política de privacidad</h1>
        <p>
          LUDIER respeta tu privacidad. Los datos recogidos en el formulario de
          contacto se utilizan para responder a tu consulta y atender tu solicitud
          de cotización.
        </p>
        <p>
          El procesamiento de las consultas y el funcionamiento del sitio pueden
          involucrar proveedores tecnológicos de correo y analítica.
        </p>
        <p>
          Para consultar sobre tus datos o solicitar el ejercicio de tus derechos,
          escríbenos a{" "}
          <a
            href="mailto:ernestoarroyo1969@hotmail.com"
            className="break-words underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ernestoarroyo1969@hotmail.com
          </a>.
        </p>
      </article>
    </section>
  );
}
