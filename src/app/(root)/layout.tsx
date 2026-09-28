import type { Metadata } from "next";
import { defaultLocale } from "@/i18n/config";
import { localizedPath, localizedUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: 'Evertrip | Transporte privado por el Caribe colombiano',
  description: 'Traslados privados, aeropuertos y viajes a tu medida por Santa Marta y la costa Caribe.',
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
