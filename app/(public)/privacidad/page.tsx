import type { Metadata } from "next";
import { Mail, Server, ShieldCheck } from "lucide-react";
import LegalPageLayout from "@/components/public/LegalPageLayout";

// FIX MOBILE F2B: destino público para el enlace legal, sin competir en búsquedas.
export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre el uso de los datos del formulario de contacto de LUDIER.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  // FIX LEGAL DESIGN: distribuir el texto original sin añadir obligaciones ni cláusulas.
  return (
    <LegalPageLayout
      title="Política de Privacidad"
      subtitle="Información sobre el uso de los datos del formulario de contacto de LUDIER."
      contactTitle="¿Tienes dudas sobre tus datos?"
      sections={[
        { id: "uso-de-datos", title: "Uso de tus datos", icon: ShieldCheck, content: <p>
          LUDIER respeta tu privacidad. Los datos recogidos en el formulario de
          contacto se utilizan para responder a tu consulta y atender tu solicitud
          de cotización.
        </p> },
        { id: "proveedores", title: "Proveedores tecnológicos", icon: Server, content: <p>
          El procesamiento de las consultas y el funcionamiento del sitio pueden
          involucrar proveedores tecnológicos de correo y analítica.
        </p> },
        { id: "derechos-y-contacto", title: "Derechos y contacto", icon: Mail, content: <p>
          Para consultar sobre tus datos o solicitar el ejercicio de tus derechos,
          escríbenos a{" "}
          <a
            href="mailto:ernestoarroyo1969@hotmail.com"
            className="break-words underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ernestoarroyo1969@hotmail.com
          </a>.
        </p> },
      ]}
    />
  );
}
