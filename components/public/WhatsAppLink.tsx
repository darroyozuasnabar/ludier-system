"use client";

import { trackEvent, withWhatsAppReference } from "@/lib/analytics";

type WhatsAppLinkProps = {
  href: string;
  location: string;
  page: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function WhatsAppLink({
  href,
  location,
  page,
  className,
  children,
  ariaLabel,
}: WhatsAppLinkProps) {
  const handleClick = () => {
    trackEvent("whatsapp_click", {
      location,
      page,
    });
  };

  return (
    <a
      // FIX TRACKING F5: referencia según location sin cambiar el texto ni el diseño del CTA.
      href={withWhatsAppReference(href, location)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
