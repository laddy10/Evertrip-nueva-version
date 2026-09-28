import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { localizedPath } from "@/lib/seo";

export default function RootPage() {
  // The root layout supplies a static refresh; this link also works without JS.
  return <Link href={localizedPath(defaultLocale)}>Continuar a Evertrip / Continue to Evertrip</Link>;
}
