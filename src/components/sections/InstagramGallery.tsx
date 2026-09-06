import type { Locale } from '@/i18n/config'
import InstagramInteractive from './InstagramInteractive'

const content = {
  es: {
    tag: '✦ SÍGUENOS EN INSTAGRAM',
    titleLine1: 'El Caribe que',
    titleLine2: 'te espera',
    quote: '"Cada viaje con Evertrip es más que un traslado. Es la libertad de disfrutar el Caribe colombiano sin preocupaciones."',
    quoteLabel: 'NUESTROS VIAJEROS',
    cta: 'Explorar Instagram',
    handle: '@evertripviajesytours',
  },
  en: {
    tag: '✦ FOLLOW US ON INSTAGRAM',
    titleLine1: 'The Caribbean',
    titleLine2: 'awaits you',
    quote: '"Every trip with Evertrip is more than a transfer. It\'s the freedom to enjoy the Colombian Caribbean without worries."',
    quoteLabel: 'OUR TRAVELERS',
    cta: 'Explore Instagram',
    handle: '@evertripviajesytours',
  },
}

export default function InstagramGallery({ locale }: { locale: Locale }) {
  const t = content[locale] || content.es

  return (
    <section className="relative bg-[#FCF8F2] overflow-hidden py-20 md:py-32 min-h-[600px]">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0A1D31 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <InstagramInteractive t={t} />
      </div>
    </section>
  )
}
