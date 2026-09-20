export const metadata = {
  title: 'Evertrip | Transporte privado por el Caribe colombiano',
  description: 'Traslados privados, aeropuertos y viajes a tu medida por Santa Marta y la costa Caribe.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
