'use client';
/**
 * @file src/components/features/HeroBanner.tsx
 * @description Banner hero responsivo — dados dinâmicos via API GET /api/v1/banners.
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BANNER_BASE_URL, API_BASE_URL } from '@/constants/site-config';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

// ── Tipo mínimo retornado pela API ────────────────────────────────────────────
interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  desktopImage: string;
  mobileImage: string;
  altText: string;
  priority: boolean;
}

// ── Skeleton para o estado de carregamento ───────────────────────────────────
function HeroBannerSkeleton() {
  return (
    <section
      className="relative w-full min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-black"
      aria-label="Carregando banner..."
      aria-busy="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
      <div className="relative container-app py-32 lg:py-48 z-10">
        <div className="max-w-3xl space-y-6 animate-pulse">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-brand-primary/30" />
            <div className="h-4 w-32 rounded bg-brand-primary/20" />
          </div>
          {/* Título */}
          <div className="space-y-3">
            <div className="h-16 w-3/4 rounded bg-white/10" />
            <div className="h-16 w-1/2 rounded bg-white/10" />
          </div>
          {/* Subtítulo */}
          <div className="space-y-2 mt-6">
            <div className="h-4 w-full max-w-lg rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
          </div>
          {/* CTAs */}
          <div className="flex gap-4 mt-10">
            <div className="h-14 w-40 rounded bg-brand-primary/20" />
            <div className="h-14 w-40 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export function HeroBanner() {
  const [banner, setBanner]     = useState<BannerData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBanners() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/v1/banners`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: BannerData[] = await res.json();

        // Prioridade: banner com priority=true primeiro, senão o primeiro da lista
        const primary = data.find(b => b.priority) ?? data[0] ?? null;
        setBanner(primary);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('[HeroBanner] Falha ao carregar banner:', err);
          setError('Não foi possível carregar o banner.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
    return () => controller.abort();
  }, []);

  // ── Estados de loading / erro ──────────────────────────────────────────────
  if (isLoading) return <HeroBannerSkeleton />;

  if (error || !banner) {
    // Renderiza uma seção mínima em caso de falha — nunca trava a página
    return (
      <section className="relative w-full min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
        <div className="relative container-app py-32 lg:py-48 z-10">
          <div className="max-w-3xl">
            <h1 id="hero-title" className="font-display text-5xl sm:text-7xl font-bold text-brand-text mb-6">
              SHOP<br />VAREJO
            </h1>
            <p className="text-brand-muted text-lg mb-10">Produtos selecionados. Qualidade garantida.</p>
            <Button as="a" href="#catalogo" variant="primary" size="lg" rightIcon={<ChevronRight size={20} aria-hidden="true" />}>
              Ver Catálogo
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ── Banner carregado ───────────────────────────────────────────────────────
  const desktopSrc  = `${BANNER_BASE_URL}/${banner.desktopImage}`;
  const mobileSrc   = `${BANNER_BASE_URL}/${banner.mobileImage}`;
  const titleLines  = banner.title.split('\n');

  return (
    <section
      className="relative w-full min-h-[80vh] lg:min-h-screen
                 flex items-center overflow-hidden bg-black"
      aria-labelledby="hero-title"
    >
      {/* Imagem desktop */}
      <div className="absolute inset-0 hidden sm:block">
        <Image
          src={desktopSrc}
          alt={banner.altText}
          fill
          priority={banner.priority}
          className="object-cover opacity-35"
          sizes="100vw"
          quality={85}
          onError={() => {}}
        />
      </div>

      {/* Imagem mobile */}
      <div className="absolute inset-0 block sm:hidden">
        <Image
          src={mobileSrc}
          alt={banner.altText}
          fill
          priority={banner.priority}
          className="object-cover opacity-30"
          sizes="100vw"
          quality={85}
          onError={() => {}}
        />
      </div>

      {/* Gradient overlay forte para legibilidade */}
      <div
        className="absolute inset-0 bg-gradient-to-r
                   from-black via-black/85 to-black/60"
        aria-hidden="true"
      />

      {/* Scan line decorativa */}
      <div
        className="absolute left-0 right-0 h-px
                   bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent
                   animate-scan pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid de fundo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#00FF00 1px, transparent 1px), ' +
            'linear-gradient(90deg, #00FF00 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

       {/* Conteúdo */}
       <div className="relative container-app py-32 lg:py-48 z-10">
         <div className="max-w-3xl">

           {/* Eyebrow com badge visual */}
           <div className="mb-8 flex items-center gap-4">
             <span className="h-px w-12 bg-brand-primary" aria-hidden="true" />
             <p className="font-mono text-brand-primary text-[10px] tracking-[0.3em] uppercase
                           border border-brand-primary/30 px-3 py-1">
               Coleção {new Date().getFullYear()}
             </p>
           </div>

           {/* Título com hierarquia melhorada */}
           <h1
             id="hero-title"
             className="font-display text-5xl sm:text-7xl lg:text-[5.5rem]
                        font-bold leading-[0.95] tracking-tight mb-6"
           >
             {titleLines.map((line, i) => (
               <span
                 key={i}
                 className={i === 0
                   ? 'text-neon block drop-shadow-[0_0_30px_#00FF0040]'
                   : 'text-brand-text block mt-2'}
               >
                 {line}
               </span>
             ))}
           </h1>

           {/* Subtítulo com destaque */}
           <p className="text-brand-muted text-base lg:text-lg leading-relaxed mb-10 max-w-lg">
             {banner.subtitle}
           </p>

           {/* CTA com foco em conversão */}
           <div className="flex flex-col sm:flex-row gap-4 items-start">
             <Button
               as="a"
               href={banner.ctaHref}
               variant="primary"
               size="lg"
               rightIcon={<ChevronRight size={20} aria-hidden="true" />}
               aria-label={`${banner.cta} — ir para o catálogo`}
               className="text-base px-10 py-4 shadow-neon hover:shadow-neon-lg transition-all"
             >
               {banner.cta}
             </Button>
             <Button
               as="a"
               href="#destaques"
               variant="outline"
               size="lg"
               aria-label="Ver produtos em destaque"
               className="text-base px-10 py-4 border-opacity-50 hover:border-opacity-100"
             >
               Ver Destaques
             </Button>
           </div>

           {/* Trust indicators inline */}
           <div className="mt-12 flex items-center gap-6 text-xs font-mono text-brand-muted/60">
             <span className="flex items-center gap-2">
               <span className="text-brand-primary">✓</span> Entrega via WA
             </span>
             <span className="flex items-center gap-2">
               <span className="text-brand-primary">✓</span> Estoque curado
             </span>
             <span className="flex items-center gap-2">
               <span className="text-brand-primary">✓</span> Suporte direto
             </span>
           </div>
         </div>
       </div>
    </section>
  );
}
