"use client";

import { signIn,signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";

import Image from "next/image";

type TipoAcceso = "equipo" | "cliente";

// ============================================================
// 🔢 Contador animado (respeta prefers-reduced-motion)
// ============================================================
function useAnimatedNumber(target: number, active: boolean, motionOk: boolean, duration = 1400) {
  const [value, setValue] = useState(motionOk && active ? 0 : target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    if (!motionOk) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, motionOk, target, duration]);

  return value;
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [motionOk, setMotionOk] = useState(true);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const [tipo, setTipo] = useState<TipoAcceso>(
    searchParams.get("tipo") === "cliente" ? "cliente" : "equipo"
  );

  const esCliente = tipo === "cliente";

  // ─── Detectar preferencia de movimiento reducido ──────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionOk(!mq.matches);
    const handler = () => setMotionOk(!mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // ─── Spotlight sutil que sigue el mouse (solo desktop, respeta reduced motion) ──
  useEffect(() => {
    if (!motionOk) return;
    const el = leftPanelRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [motionOk]);

  const obras = useAnimatedNumber(19, esCliente && mounted, motionOk);
  const avance = useAnimatedNumber(68, esCliente && mounted, motionOk, 1800);

  // ─── Redirigir según el rol ──────────────────────────────────────
  const redirectByRole = (role: string) => {
    const routes: Record<string, string> = {
      FUNDADOR: "/dashboard",
      ADMIN: "/dashboard",
      FIELD_ENGINEER: "/personal",
      PRODUCTION: "/produccion",
      VIEWER: "/obras",
      CLIENTE: "/cliente/dashboard",
    };
    router.push(routes[role] || "/");
  };

  useEffect(() => {
    setMounted(true);
    if (status === "authenticated" && session?.user?.role) {
      redirectByRole(session.user.role);
    }
  }, [status, session]);

  // ─── Enviar formulario ───────────────────────────────────────────
  // ─── Enviar formulario ───────────────────────────────────────────
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    setError("Correo o contraseña incorrectos.");
    setLoading(false);
    return;
  }

  // ✅ Verificar el rol después del login
  setTimeout(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      const role = sessionData?.user?.role;

      // 🔥 VALIDAR ROL CONTRA EL TOGGLE
      if (tipo === "cliente" && role !== "CLIENTE") {
        setError("⚠️ Esta cuenta no tiene acceso al panel de cliente. Usa la pestaña 'Equipo LUDIER'.");
        setLoading(false);
        await signOut({ redirect: false });
        return;
      }

      if (tipo === "equipo" && role === "CLIENTE") {
        setError("⚠️ Los clientes deben ingresar desde la pestaña 'Cliente'.");
        setLoading(false);
        await signOut({ redirect: false });
        return;
      }

      // ✅ Redirigir según el rol
      if (role) {
        redirectByRole(role);
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    }
  }, 300);
};
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .l-root {
          min-height: 100vh;
          background: #0a0a0a;
          font-family: 'Barlow', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .l-topbar {
          height: 4px;
          background: linear-gradient(90deg, #E07B20 0%, #f5a623 50%, #E07B20 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease infinite;
          flex-shrink: 0;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .l-main { flex: 1; display: flex; flex-direction: column; }
        @media (min-width: 768px) { .l-main { flex-direction: row; } }

        .l-left {
          position: relative;
          overflow: hidden;
          background: #0f0f0f;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 3rem 2rem 3rem 2.5rem;
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .l-left { flex: 1; padding: 4rem 5rem; border-right: 1px solid #1a1a1a; }
        }

        .l-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .l-spotlight {
          position: absolute;
          inset: 0;
          background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 30%), rgba(224,123,32,0.06), transparent 60%);
          transition: background 0.15s ease-out;
          pointer-events: none;
        }

        .l-bg-text {
          position: absolute;
          bottom: -3rem;
          left: -1rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(100px, 16vw, 200px);
          font-weight: 800;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.035);
          line-height: 1;
          user-select: none;
          white-space: nowrap;
          pointer-events: none;
        }

        .l-accent-v {
          position: absolute; left: 0; top: 12%; bottom: 12%; width: 3px;
          background: #E07B20; border-radius: 0 2px 2px 0;
        }
        @media (min-width: 768px) { .l-accent-v { display: none; } }

        .l-content { position: relative; z-index: 2; width: 100%; max-width: 540px; }

        .l-logo-wrap {
          margin-bottom: 2rem; opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .l-logo-wrap.vis { opacity: 1; transform: translateY(0); }

        .l-plate {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #6E7379;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s;
        }
        .l-plate.vis { opacity: 1; transform: translateY(0); }
        .l-plate-dot { width: 5px; height: 5px; border-radius: 50%; background: #E07B20; }

        .l-tagline {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(40px, 6vw, 68px);
          font-weight: 800;
          color: #fff;
          line-height: 0.95;
          letter-spacing: -1px;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .l-tagline.vis { opacity: 1; transform: translateY(0); }
        .l-tagline span { color: #E07B20; }

        .l-desc {
          font-size: 15px; color: #555; line-height: 1.65; max-width: 400px;
          margin-bottom: 2.5rem;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .l-desc.vis { opacity: 1; transform: translateY(0); }

        .l-roles {
          display: flex; gap: 10px; flex-wrap: wrap;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
        }
        .l-roles.vis { opacity: 1; transform: translateY(0); }

        .l-role {
          display: flex; align-items: center; gap: 10px;
          background: #141414; border: 1px solid #222; border-radius: 10px;
          padding: 10px 14px; transition: border-color 0.2s, background 0.2s;
        }
        .l-role:hover { border-color: #E07B20; background: #181818; }
        .l-role-icon {
          width: 34px; height: 34px; background: #1c1c1c; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; flex-shrink: 0;
        }
        .l-role-name { font-size: 13px; font-weight: 600; color: #bbb; display: block; line-height: 1.2; }
        .l-role-sub { font-size: 11px; color: #444; display: block; }

        /* ── SIGNATURE: plano técnico animado (modo cliente) ── */
        .cl-wrap {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
          margin-bottom: 2rem;
        }
        .cl-wrap.vis { opacity: 1; transform: translateY(0); }

        .cl-svg-box {
          position: relative;
          background: rgba(255,255,255,0.015);
          border: 1px solid #1c1c1c;
          border-radius: 12px;
          padding: 1.25rem 1.5rem 0.75rem;
        }

        .cl-draw {
          stroke: #C7CBD1;
          fill: none;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .cl-draw-accent { stroke: #E07B20; }
        .cl-joint { fill: #E07B20; }
        .cl-dim { stroke: #444; stroke-width: 1; }
        .cl-dim-text {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 7px;
          fill: #555;
        }

        .cl-anim .cl-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: draw-line 1.1s ease-out forwards;
        }
        .cl-anim .cl-joint {
          opacity: 0;
          animation: joint-spark 0.5s ease-out forwards;
        }
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes joint-spark {
          0% { opacity: 0; transform: scale(0.2); }
          55% { opacity: 1; transform: scale(1.6); }
          100% { opacity: 1; transform: scale(1); }
        }
        .cl-no-motion .cl-draw { stroke-dasharray: none; stroke-dashoffset: 0; }
        .cl-no-motion .cl-joint { opacity: 1; }

        .cl-plate-label {
          position: absolute;
          top: 10px; right: 14px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #3a3a3a;
        }

        .cl-stats {
          display: flex;
          gap: 0;
          margin-top: 0.25rem;
          border-top: 1px solid #1c1c1c;
        }
        .cl-stat {
          flex: 1;
          padding: 0.85rem 0.5rem 0.15rem;
          text-align: center;
          border-right: 1px solid #1c1c1c;
        }
        .cl-stat:last-child { border-right: none; }
        .cl-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .cl-stat-num span { color: #E07B20; }
        .cl-stat-label {
          font-size: 9.5px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 4px;
          display: block;
        }

        .cl-ring-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 1.1rem;
          padding: 0 0.5rem 1rem;
        }
        .cl-ring-track {
          stroke: #1c1c1c;
          fill: none;
          stroke-width: 6;
        }
        .cl-ring-fill {
          stroke: #E07B20;
          fill: none;
          stroke-width: 6;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cl-ring-pct {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          fill: #fff;
        }
        .cl-ring-copy {
          font-size: 12px;
          color: #8A8F96;
          line-height: 1.4;
        }
        .cl-ring-copy b { color: #C7CBD1; font-weight: 600; }

        /* RIGHT */
        .l-right {
          background: #0a0a0a; display: flex; flex-direction: column;
          justify-content: center; padding: 3rem 2rem; position: relative;
        }
        @media (min-width: 768px) { .l-right { width: 440px; padding: 4rem 3.5rem; flex-shrink: 0; } }
        @media (min-width: 1280px) { .l-right { width: 500px; padding: 4rem 4.5rem; } }

        .l-toggle {
          position: relative;
          display: flex;
          background: #141414;
          border: 1px solid #222;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 2rem;
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
        }
        .l-toggle.vis { opacity: 1; transform: translateY(0); }

        .l-toggle-slider {
          position: absolute;
          top: 4px; left: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: #E07B20;
          border-radius: 7px;
          transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .l-toggle-slider.right { transform: translateX(100%); }

        .l-toggle-btn {
          position: relative;
          z-index: 1;
          flex: 1;
          border: none;
          background: transparent;
          color: #666;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 10px 12px;
          border-radius: 7px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .l-toggle-btn.active { color: #fff; }
        .l-toggle-btn:not(.active):hover { color: #999; }

        .l-form-header {
          margin-bottom: 2.5rem;
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
        }
        .l-form-header.vis { opacity: 1; transform: translateY(0); }

        .l-eyebrow {
          font-size: 11px; font-weight: 600; color: #E07B20;
          letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;
        }
        .l-form-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700; color: #fff; line-height: 1.05; text-transform: uppercase;
        }

        .l-form-body {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
        }
        .l-form-body.vis { opacity: 1; transform: translateY(0); }

        .l-field { margin-bottom: 1.25rem; }
        .l-label {
          display: block; font-size: 11px; font-weight: 600; color: #666;
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;
        }
        .l-input-wrap { position: relative; }
        .l-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #333; font-size: 17px; pointer-events: none; transition: color 0.2s; line-height: 1;
        }
        .l-input {
          width: 100%; height: 56px; background: #111; border: 1px solid #1e1e1e;
          border-radius: 10px; color: #fff; font-size: 16px; font-family: 'Barlow', sans-serif;
          padding: 0 16px 0 48px; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .l-input:focus { border-color: #E07B20; box-shadow: 0 0 0 3px rgba(224,123,32,0.12); }
        .l-input::placeholder { color: #333; font-size: 14px; }
        .l-input-wrap:focus-within .l-input-icon { color: #E07B20; }

        .l-error {
          display: flex; align-items: center; gap: 10px;
          background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.2);
          border-radius: 10px; padding: 12px 16px; margin-bottom: 1.25rem;
          font-size: 14px; color: #f87171; animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }
        }

        .l-btn {
          width: 100%; height: 58px; background: #E07B20; border: none; border-radius: 10px;
          color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-top: 0.5rem; transition: background 0.2s, transform 0.12s, box-shadow 0.2s; position: relative;
        }
        .l-btn:hover { background: #cf7219; box-shadow: 0 8px 28px rgba(224,123,32,0.28); transform: translateY(-1px); }
        .l-btn:active { transform: scale(0.98); box-shadow: none; }
        .l-btn:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; transform: none; box-shadow: none; }

        .l-spinner {
          width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .l-footer {
          padding: 14px 2rem; border-top: 1px solid #111;
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .l-footer-l { font-size: 11px; color: #2a2a2a; letter-spacing: 1px; }
        .l-footer-r { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #2a2a2a; }
        .l-dot { width: 6px; height: 6px; background: #1e1e1e; border-radius: 50%; }
        .l-dot.on {
          background: #22c55e; box-shadow: 0 0 8px rgba(34,197,94,0.5); animation: blink 2.5s ease infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

        @media (prefers-reduced-motion: reduce) {
          .l-logo-wrap, .l-plate, .l-tagline, .l-desc, .l-roles, .cl-wrap, .l-toggle, .l-form-header, .l-form-body {
            transition: none !important;
          }
        }
      `}</style>

      <div className="l-root">
        <div className="l-topbar" />

        <div className="l-main">

          {/* LEFT */}
          <div className="l-left" ref={leftPanelRef}>
            <div className="l-grid" />
            {motionOk && <div className="l-spotlight" />}
            <div className="l-bg-text">LUDIER</div>
            <div className="l-accent-v" />

            <div className="l-content">
              <div className={`l-logo-wrap ${mounted ? "vis" : ""}`}>
                <Image
                  src="/img/logo-ludier.png"
                  alt="Ludier"
                  width={190}
                  height={86}
                  className="object-contain"
                  priority
                />
              </div>

              <div className={`l-plate ${mounted ? "vis" : ""}`}>
                <span className="l-plate-dot" />
                {esCliente ? "PLANO N.º LC-2026 · PORTAL CLIENTE" : "SISTEMA INTERNO · ACCESO RESTRINGIDO"}
              </div>

              {esCliente ? (
                <>
                  <div className={`l-tagline ${mounted ? "vis" : ""}`}>
                    Sigue tu<br />
                    <span>obra</span><br />
                    en tiempo real
                  </div>
                  <p className={`l-desc ${mounted ? "vis" : ""}`}>
                    Avance, fotos y valorizaciones de tu proyecto,
                    siempre a un clic de distancia.
                  </p>

                  {/* ── SIGNATURE: plano técnico + progreso ── */}
                  <div className={`cl-wrap ${mounted ? "vis" : ""}`}>
                    <div className="cl-svg-box">
                      <span className="cl-plate-label">ESC 1:50</span>
                      <svg
                        key={esCliente ? "cliente-on" : "cliente-off"}
                        viewBox="0 0 320 150"
                        className={motionOk ? "cl-anim" : "cl-no-motion"}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      >
                        {/* Postes */}
                        <line pathLength={1} className="cl-draw" x1="30" y1="20" x2="30" y2="120" style={{ animationDelay: "0.05s" }} />
                        <line pathLength={1} className="cl-draw" x1="290" y1="20" x2="290" y2="120" style={{ animationDelay: "0.1s" }} />
                        {/* Viga superior */}
                        <line pathLength={1} className="cl-draw cl-draw-accent" x1="30" y1="20" x2="290" y2="20" style={{ animationDelay: "0.25s" }} />
                        {/* Riostras diagonales */}
                        <line pathLength={1} className="cl-draw" x1="30" y1="20" x2="70" y2="55" style={{ animationDelay: "0.4s" }} />
                        <line pathLength={1} className="cl-draw" x1="290" y1="20" x2="250" y2="55" style={{ animationDelay: "0.45s" }} />
                        {/* Cerco / barrotes verticales */}
                        {Array.from({ length: 11 }).map((_, i) => (
                          <line
                            key={i}
                            pathLength={1}
                            className="cl-draw"
                            x1={55 + i * 21}
                            y1="60"
                            x2={55 + i * 21}
                            y2="120"
                            style={{ animationDelay: `${0.55 + i * 0.03}s` }}
                          />
                        ))}
                        {/* Zócalo horizontal */}
                        <line pathLength={1} className="cl-draw" x1="30" y1="120" x2="290" y2="120" style={{ animationDelay: "0.9s" }} />
                        {/* Nudos soldados */}
                        <circle className="cl-joint" cx="30" cy="20" r="3.2" style={{ animationDelay: "1.05s" }} />
                        <circle className="cl-joint" cx="290" cy="20" r="3.2" style={{ animationDelay: "1.1s" }} />
                        <circle className="cl-joint" cx="30" cy="120" r="3.2" style={{ animationDelay: "1.15s" }} />
                        <circle className="cl-joint" cx="290" cy="120" r="3.2" style={{ animationDelay: "1.2s" }} />
                        {/* Cota de medida */}
                        <line pathLength={1} className="cl-draw cl-dim" x1="30" y1="136" x2="290" y2="136" style={{ animationDelay: "1.3s" }} />
                        <line pathLength={1} className="cl-draw cl-dim" x1="30" y1="130" x2="30" y2="142" style={{ animationDelay: "1.3s" }} />
                        <line pathLength={1} className="cl-draw cl-dim" x1="290" y1="130" x2="290" y2="142" style={{ animationDelay: "1.3s" }} />
                        <text x="160" y="148" textAnchor="middle" className="cl-dim-text">5.20 m</text>
                      </svg>

                      <div className="cl-stats">
                        <div className="cl-stat">
                          <div className="cl-stat-num"><span>{obras}</span>+</div>
                          <span className="cl-stat-label">Obras ejecutadas</span>
                        </div>
                        <div className="cl-stat">
                          <div className="cl-stat-num">100<span>%</span></div>
                          <span className="cl-stat-label">Trazabilidad</span>
                        </div>
                        <div className="cl-stat">
                          <div className="cl-stat-num">24<span>/7</span></div>
                          <span className="cl-stat-label">Acceso online</span>
                        </div>
                      </div>

                      <div className="cl-ring-wrap">
                        <svg width="56" height="56" viewBox="0 0 56 56">
                          <circle className="cl-ring-track" cx="28" cy="28" r="24" />
                          <circle
                            className="cl-ring-fill"
                            cx="28" cy="28" r="24"
                            pathLength={100}
                            strokeDasharray={100}
                            strokeDashoffset={mounted ? 100 - avance : 100}
                          />
                          <text x="28" y="32" textAnchor="middle" className="cl-ring-pct">{avance}%</text>
                        </svg>
                        <p className="cl-ring-copy">
                          Ejemplo de vista: así se ve el <b>avance real</b> de tu proyecto dentro del panel.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`l-tagline ${mounted ? "vis" : ""}`}>
                    Control<br />
                    <span>total</span><br />
                    de obra
                  </div>
                  <p className={`l-desc ${mounted ? "vis" : ""}`}>
                    Plataforma interna de gestión operativa — producción,
                    costos, inventario y obra en un solo lugar.
                  </p>
                  <div className={`l-roles ${mounted ? "vis" : ""}`}>
                    {[
                      { icon: "👑", name: "Gerencia", sub: "Visión global" },
                      { icon: "🏗️", name: "Ingeniería", sub: "Obra y calidad" },
                      { icon: "🔧", name: "Operativo", sub: "Producción" },
                    ].map((r) => (
                      <div className="l-role" key={r.name}>
                        <div className="l-role-icon">{r.icon}</div>
                        <div>
                          <span className="l-role-name">{r.name}</span>
                          <span className="l-role-sub">{r.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="l-right">
            <div className={`l-toggle ${mounted ? "vis" : ""}`}>
              <div className={`l-toggle-slider ${esCliente ? "right" : ""}`} />
              <button
                type="button"
                className={`l-toggle-btn ${!esCliente ? "active" : ""}`}
                onClick={() => setTipo("equipo")}
              >
                Equipo LUDIER
              </button>
              <button
                type="button"
                className={`l-toggle-btn ${esCliente ? "active" : ""}`}
                onClick={() => setTipo("cliente")}
              >
                Cliente
              </button>
            </div>

            <div className={`l-form-header ${mounted ? "vis" : ""}`}>
              <div className="l-eyebrow">
                {esCliente ? "Panel de seguimiento" : "Acceso al sistema"}
              </div>
              <div className="l-form-title">
                Ingresa tus<br />credenciales
              </div>
            </div>

            <div className={`l-form-body ${mounted ? "vis" : ""}`}>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="l-error">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="l-field">
                  <label className="l-label" htmlFor="email">Correo electrónico</label>
                  <div className="l-input-wrap">
                    <span className="l-input-icon">✉</span>
                    <input
                      id="email"
                      className="l-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ludier.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="l-field">
                  <label className="l-label" htmlFor="password">Contraseña</label>
                  <div className="l-input-wrap">
                    <span className="l-input-icon">🔒</span>
                    <input
                      id="password"
                      className="l-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <button className="l-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <><div className="l-spinner" /> Verificando...</>
                  ) : (
                    <>Ingresar <span style={{ fontSize: 22, lineHeight: 1 }}>→</span></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="l-footer">
          <span className="l-footer-l">LUDIER SYSTEM © 2026</span>
          <div className="l-footer-r">
            <div className={`l-dot ${mounted ? "on" : ""}`} />
            <span>Sistema en línea</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}