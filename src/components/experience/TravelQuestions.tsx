import { ArrowUpRight, Plus } from "lucide-react";
import { faqsByLocale } from "@/data/faq";
import { getWhatsAppLink } from "@/data/routes";
import type { Locale } from "@/i18n/config";

export default function TravelQuestions({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <section
      className="travel-questions"
      id="faq"
      aria-labelledby="questions-title"
    >
      <div>
        <span className="chapter-caption">
          {es ? "Antes de salir" : "Before you set off"}
        </span>
        <h2 id="questions-title">
          {es ? "Viaja con\nla mente libre." : "Travel with\na clear mind."}
        </h2>
        <p>
          {es
            ? "Resolvemos tus dudas. Del primer mensaje hasta tu destino, estamos contigo."
            : "Let’s answer your questions. From the first message to your destination, we’re here."}
        </p>
        <a
          className="text-link"
          href={getWhatsAppLink(
            es
              ? "Hola, tengo una pregunta sobre los traslados."
              : "Hi, I have a question about the transfers.",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {es ? "Hablemos por WhatsApp" : "Let’s talk on WhatsApp"}
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="questions-list">
        {faqsByLocale[locale].map((faq, index) => (
          <details key={faq.q} open={index === 0}>
            <summary>
              {faq.q}
              <Plus size={19} aria-hidden="true" />
            </summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
