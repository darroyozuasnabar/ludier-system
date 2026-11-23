"use client";

import type { MouseEvent, ReactNode } from "react";

export default function ScrollToLink({
  targetId,
  children,
  className,
}: {
  targetId: string;
  children: ReactNode;
  className?: string;
}) {
  function scroll(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    window.history.replaceState(window.history.state, "", `#${targetId}`);
    target.focus({ preventScroll: true });
  }

  return <a href={`#${targetId}`} onClick={scroll} className={className}>{children}</a>;
}
