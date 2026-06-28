export default function CotizacionDetalleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // Si necesitas usar params en el layout
  // const { id } = use(params);
  return <>{children}</>;
}