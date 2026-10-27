import type { Metadata } from "next";
import { defaultLocale } from "@/i18n/config";
import { localizedPath, localizedUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: 'Transporte Privado en Santa Marta y Traslados Caribe | EverTrip',
  description: 'Transporte privado puerta a puerta en Santa Marta y el Caribe. Traslados a aeropuertos, Palomino, Tayrona, Minca y Cartagena. Cotiza por WhatsApp con EverTrip.',
  alternates: { canonical: localizedUrl(defaultLocale) },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${localizedPath(defaultLocale)}`} />
      </head>
      <body>{children}</body>
    </html>
  )
}
