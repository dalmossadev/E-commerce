'use client';
/**
 * @file src/components/features/HeroBanner.tsx
 * @description Banner hero responsivo — desktop e mobile a partir do config.
 */
import Image from 'next/image';
import { BANNERS, BANNER_BASE_URL } from '@/constants/site-config';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';


type HeroBannerProps = {
  bannerId?: string;  // Usa o primeiro banner por padrão
};

export function HeroBanner({ bannerId }: HeroBannerProps) {
  const banner = bannerId
    ? BANNERS.find(b => b.id === bannerId) ?? BANNERS[0]
    : BANNERS[0];

  if (!banner) return null;

  const desktopSrc = `${BANNER_BASE_URL}/${banner.desktopImage}`;
  const mobileSrc  = `${BANNER_BASE_URL}/${banner.mobileImage}`;

  // Linhas do título (suporta \n no config)
  const titleLines = banner.title.split('\n');

  return (
    <section
      className="relative w-full min-h-[60vh] lg:min-h-[80vh]
                 flex items-center overflow-hidden bg-brand-surface"
      aria-labelledby="hero-title"
    >
      {/* Imagem desktop */}
      <div className="absolute inset-0 hidden sm:block">
        <Image
          src={desktopSrc}
          alt={banner.altText}
          fill
          priority={banner.priority}
          className="object-cover opacity-40"
          sizes="100vw"
          quality={80}
          onError={() => {}} // silencia erro — overlay garante legibilidade
        />
      </div>

      {/* Imagem mobile */}
      <div className="absolute inset-0 block sm:hidden">
        <Image
          src={mobileSrc}
          alt={banner.altText}
          fill
          priority={banner.priority}
          className="object-cover opacity-35"
          sizes="100vw"
          quality={80}
          onError={() => {}}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r
                   from-black via-black/80 to-transparent"
        aria-hidden="true"
      />

      {/* Scan line decorativa */}
      <div
        className="absolute left-0 right-0 h-px
                   bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent
                   animate-scan pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid de fundo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#00FF00 1px, transparent 1px), ' +
            'linear-gradient(90deg, #00FF00 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative container-app py-20 lg:py-32 z-10">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <p className="font-mono text-brand-primary text-xs tracking-[0.3em] uppercase
                        mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-brand-primary" aria-hidden="true" />
            Shop Varejo · Coleção Atual
          </p>

          {/* Título */}
          <h1
            id="hero-title"
            className="font-display text-4xl sm:text-5xl lg:text-7xl
                       font-bold leading-none tracking-tight mb-6"
          >
            {titleLines.map((line, i) => (
              <span
                key={i}
                className={i === 0 ? 'text-neon block' : 'text-brand-text block'}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Subtítulo */}
          <p className="text-brand-muted text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
            {banner.subtitle}
          </p>

          {/* CTA */}
          <Button
            as="a"
            href={banner.ctaHref}
            variant="primary"
            size="lg"
            rightIcon={<ChevronRight size={18} aria-hidden="true" />}
            aria-label={`${banner.cta} — ir para o catálogo`}
          >
            {banner.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
