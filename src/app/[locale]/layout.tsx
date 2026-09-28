import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import "../globals.css";
import "../experience.css";

const outfit = localFont({
  src: "../../../public/fonts/outfit-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-outfit",
});

const inter = localFont({
  src: "../../../public/fonts/inter-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

export const dynamicParams = false;

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Transporte privado puerta a puerta | Barranquilla, Santa Marta, Palomino | EverTrip",
    description:
      "Traslados privados puerta a puerta por la costa Caribe: Barranquilla, Santa Marta, Cartagena, Palomino y Valledupar. Reserva por WhatsApp en minutos.",
  },
  en: {
    title: "Private Door-to-Door Transfers | Barranquilla, Santa Marta, Palomino | EverTrip",
    description:
      "Private door-to-door transfers across the Caribbean coast: Barranquilla, Santa Marta, Cartagena, Palomino and Valledupar. Book on WhatsApp in minutes.",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const meta = metaByLocale[locale];

  return {
    ...pageMetadata({ locale, ...meta }),
    icons: {
      icon: "/assets/logo2-rounded-ui.png",
      apple: "/assets/logo2-apple-touch.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;

  return (
    <html lang={locale} className={`${outfit.variable} ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <div className="showcase-credit print:hidden">
          {locale === "es" ? "Diseño creado con " : "Design created with "}<strong>GPT-6 Astra</strong> · Ultra
        </div>
        <Navbar locale={locale} />
        <main className="flex-grow">{children}</main>
        <div className="print:hidden">
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
