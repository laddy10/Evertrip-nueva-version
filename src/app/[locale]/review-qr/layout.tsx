import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return pageMetadata({
    locale,
    path: "review-qr",
    title: locale === "es" ? "Código QR para reseñas | EverTrip" : "Review QR Code | EverTrip",
    description: locale === "es"
      ? "Aviso imprimible con código QR para compartir tu experiencia con Evertrip en Google."
      : "Printable QR code sign for sharing your Evertrip experience on Google.",
    image: "/assets/logo2-normal-review.png",
    indexable: false,
  });
}

// Metadata only: keep the existing client page and print behavior intact.
export default function ReviewQRLayout({ children }: { children: React.ReactNode }) {
  return children;
}
