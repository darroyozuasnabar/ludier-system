"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ─── Redirigir según el rol ──────────────────────────────────────
  const redirectByRole = (role: string) => {
    const routes: Record<string, string> = {
      FUNDADOR: "/dashboard",
      ADMIN: "/dashboard",
      FIELD_ENGINEER: "/personal",
      PRODUCTION: "/produccion",
      VIEWER: "/obras",
      // 👇 FIX: faltaba CLIENTE, caía en el fallback "/" (landing).
      // Esto también explicaba el "loop" hacia la landing: con una sesión
      // CLIENTE ya activa, cualquier visita a esta página (aunque fuera
      // sin querer, dado que hay 2 logins distintos) disparaba el
      // useEffect de abajo y rebotaba a "/" instantáneamente.
      CLIENTE: "/cliente/dashboard",
    };
    router.push(routes[role] || "/");
  };

  useEffect(() => {
    setMounted(true);
    // Si ya hay sesión (ej. recarga de página), redirigir directamente
    if (status === "authenticated" && session?.user?.role) {
      redirectByRole(session.user.role);
    }
  }, [status, session]);

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

    // Pequeña pausa para que la sesión se actualice en el servidor
    setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/session");
        const sessionData = await res.json();
        if (sessionData?.user?.role) {
          redirectByRole(sessionData.user.role);
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
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap');

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

        .l-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .l-main { flex-direction: row; }
        }

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
          .l-left {
            flex: 1;
            padding: 4rem 5rem;
            border-right: 1px solid #1a1a1a;
          }
        }

        .l-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 60px 60px;
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
          position: absolute;
          left: 0;
          top: 12%;
          bottom: 12%;
          width: 3px;
          background: #E07B20;
          border-radius: 0 2px 2px 0;
        }

        @media (min-width: 768px) {
          .l-accent-v { display: none; }
        }

        .l-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 540px;
        }

        .l-logo-wrap {
          margin-bottom: 2.5rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .l-logo-wrap.vis { opacity: 1; transform: translateY(0); }

        .l-tagline {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 800;
          color: #fff;
          line-height: 0.95;
          letter-spacing: -1px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .l-tagline.vis { opacity: 1; transform: translateY(0); }
        .l-tagline span { color: #E07B20; }

        .l-desc {
          font-size: 15px;
          color: #555;
          line-height: 1.65;
          max-width: 400px;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .l-desc.vis { opacity: 1; transform: translateY(0); }

        .l-roles {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
        }
        .l-roles.vis { opacity: 1; transform: translateY(0); }

        .l-role {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #141414;
          border: 1px solid #222;
          border-radius: 10px;
          padding: 10px 14px;
          cursor: default;
          transition: border-color 0.2s, background 0.2s;
        }
        .l-role:hover { border-color: #E07B20; background: #181818; }

        .l-role-icon {
          width: 34px;
          height: 34px;
          background: #1c1c1c;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }

        .l-role-name {
          font-size: 13px;
          font-weight: 600;
          color: #bbb;
          display: block;
          line-height: 1.2;
        }
        .l-role-sub {
          font-size: 11px;
          color: #444;
          display: block;
        }

        /* RIGHT */
        .l-right {
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 2rem;
          position: relative;
        }

        @media (min-width: 768px) {
          .l-right { width: 440px; padding: 4rem 3.5rem; flex-shrink: 0; }
        }
        @media (min-width: 1280px) {
          .l-right { width: 500px; padding: 4rem 4.5rem; }
        }

        .l-form-header {
          margin-bottom: 2.5rem;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
        }
        .l-form-header.vis { opacity: 1; transform: translateY(0); }

        .l-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #E07B20;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .l-form-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          color: #fff;
          line-height: 1.05;
          text-transform: uppercase;
        }

        .l-form-body {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
        }
        .l-form-body.vis { opacity: 1; transform: translateY(0); }

        .l-field { margin-bottom: 1.25rem; }

        .l-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #666;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .l-input-wrap { position: relative; }

        .l-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #333;
          font-size: 17px;
          pointer-events: none;
          transition: color 0.2s;
          line-height: 1;
        }

        .l-input {
          width: 100%;
          height: 56px;
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          font-family: 'Barlow', sans-serif;
          padding: 0 16px 0 48px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .l-input:focus {
          border-color: #E07B20;
          box-shadow: 0 0 0 3px rgba(224,123,32,0.12);
        }
        .l-input::placeholder { color: #333; font-size: 14px; }
        .l-input-wrap:focus-within .l-input-icon { color: #E07B20; }

        .l-error {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(220,38,38,0.07);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 1.25rem;
          font-size: 14px;
          color: #f87171;
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .l-btn {
          width: 100%;
          height: 58px;
          background: #E07B20;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 0.5rem;
          transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
          position: relative;
        }
        .l-btn:hover {
          background: #cf7219;
          box-shadow: 0 8px 28px rgba(224,123,32,0.28);
          transform: translateY(-1px);
        }
        .l-btn:active { transform: scale(0.98); box-shadow: none; }
        .l-btn:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; transform: none; box-shadow: none; }

        .l-spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .l-sep {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.75rem 0 0.75rem;
        }
        .l-sep-line { flex: 1; height: 1px; background: #181818; }
        .l-sep-txt { font-size: 11px; color: #333; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }

        /* FOOTER */
        .l-footer {
          padding: 14px 2rem;
          border-top: 1px solid #111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .l-footer-l { font-size: 11px; color: #2a2a2a; letter-spacing: 1px; }
        .l-footer-r { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #2a2a2a; }
        .l-dot {
          width: 6px; height: 6px;
          background: #1e1e1e;
          border-radius: 50%;
        }
        .l-dot.on {
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,0.5);
          animation: blink 2.5s ease infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <div className="l-root">
        <div className="l-topbar" />

        <div className="l-main">

          {/* LEFT */}
          <div className="l-left">
            <div className="l-grid" />
            <div className="l-bg-text">LUDIER</div>
            <div className="l-accent-v" />

            <div className="l-content">
              <div className={`l-logo-wrap ${mounted ? "vis" : ""}`}>
                <Image
                  src="/img/logo-ludier.png"
                  alt="Ludier"
                  width={210}
                  height={95}
                  className="object-contain"
                  priority
                />
              </div>

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
            </div>
          </div>

          {/* RIGHT */}
          <div className="l-right">
            <div className={`l-form-header ${mounted ? "vis" : ""}`}>
              <div className="l-eyebrow">Acceso al sistema</div>
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