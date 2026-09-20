import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { locales, isLocale, defaultLocale, type Locale } from "@/i18n/config";
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

const SITE_URL = "https://evertrip.co";

const metaByLocale: Record<Locale, { title: string; description: string; locale: string }> = {
  es: {
    title: "Transporte privado puerta a puerta | Barranquilla, Santa Marta, Palomino | EverTrip",
    description:
      "Traslados privados puerta a puerta por la costa Caribe: Barranquilla, Santa Marta, Cartagena, Palomino y Valledupar. Reserva por WhatsApp en minutos.",
    locale: "es_CO",
  },
  en: {
    title: "Private Door-to-Door Transfers | Barranquilla, Santa Marta, Palomino | EverTrip",
    description:
      "Private door-to-door transfers across the Caribbean coast: Barranquilla, Santa Marta, Cartagena, Palomino and Valledupar. Book on WhatsApp in minutes.",
    locale: "en_US",
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
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const meta = metaByLocale[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    icons: {
      icon: "/assets/logo2-rounded-ui.png",
      apple: "/assets/logo2-apple-touch.png",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: "EverTrip",
      locale: meta.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
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
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

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
