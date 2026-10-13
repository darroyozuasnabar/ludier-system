// app/servicios/layout.tsx
export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#F7F7F4]">{children}</div>;
}