"use client";

import { trackEvent } from "@/lib/analytics";

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
      href={href}
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