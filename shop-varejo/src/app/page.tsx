'use client';

import { HeroBanner } from '@/components/features/HeroBanner';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/Button';
import { useSiteInfo } from '@/hooks/useSiteInfo';
import { Zap, Truck, Shield, Headphones, RefreshCw } from 'lucide-react';

export default function Home() {
  const { siteInfo } = useSiteInfo();

  return (
    <main>
      {/* Hero Section - Primeiro impacto visual */}
      <HeroBanner />

      {/* Catálogo - Produtos em Destaque (CTA imediato após Hero) */}
      <section id="destaques" className="py-16 lg:py-24 bg-black" aria-labelledby="destaques-title">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-brand-primary text-[10px] tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                <span className="h-px w-8 bg-brand-primary" aria-hidden="true" />
                Seleção premium
              </p>
              <h2 id="destaques-title" className="font-display text-3xl lg:text-4xl font-bold text-brand-text">
                Destaques
              </h2>
              <p className="text-sm text-brand-muted mt-2 max-w-md">
                Produtos selecionados com curadoria técnica
              </p>
            </div>
            <Button
              as="a"
              href="#catalogo"
              variant="outline"
              size="sm"
              className="w-fit"
            >
              Ver Todos
            </Button>
          </div>

          <ProductGrid limit={8} />
        </div>
      </section>

      {/* TrustBar - Prova social logo após produtos */}
      <section className="border-y border-brand-border bg-brand-surface/50 backdrop-blur-sm" aria-label="Confiança e benefícios">
        <div className="container-app py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: <Truck size={20} />, label: 'Entrega Direta', sub: 'Via WhatsApp' },
              { icon: <Shield size={20} />, label: 'Produtos Curados', sub: 'Qualidade garantida' },
              { icon: <Headphones size={20} />, label: 'Suporte Humanizado', sub: 'Atendimento direto' },
              { icon: <RefreshCw size={20} />, label: 'Troca Facilitada', sub: 'Sem burocracia' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group hover:text-brand-primary transition-colors">
                <div className="text-brand-primary group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-brand-text uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-brand-muted">
                    {item.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Alta conversão (fluxo: viu produtos -> prova social -> CTA) */}
      <section className="relative py-20 lg:py-32 bg-brand-surface overflow-hidden" aria-labelledby="cta-title">
        {/* Background effect */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#00FF00 1px, transparent 1px), linear-gradient(90deg, #00FF00 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} aria-hidden="true" />

        <div className="container-app relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-mono text-brand-primary text-[10px] tracking-[0.3em] uppercase mb-4">
              Atendimento direto
            </p>
            <h2 id="cta-title" className="font-display text-3xl lg:text-5xl font-bold text-brand-text mb-6 leading-tight">
              Comprar no <span className="text-neon">{siteInfo.name}</span> é simples
            </h2>
            <p className="text-brand-muted text-base mb-10 max-w-lg mx-auto">
              Escolha, clique e fale conosco no WhatsApp. Sem carrinho complexo, sem cadastro. Atendimento humano em minutos.
            </p>

            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
              {[
                { step: '01', title: 'Escolha', desc: 'Navegue e encontre o produto ideal' },
                { step: '02', title: 'Clique', desc: 'Toque em "Comprar via WA"' },
                { step: '03', title: 'Converse', desc: 'Atendimento direto e humano' },
              ].map((item, i) => (
                <div key={i} className="relative p-4 border border-brand-border rounded-lg hover:border-brand-primary/50 transition-colors group">
                  <span className="font-mono text-brand-primary/30 text-4xl font-bold absolute -top-2 -left-1 group-hover:text-brand-primary/50 transition-colors">
                    {item.step}
                  </span>
                  <h3 className="font-display text-sm font-bold text-brand-text mt-4 mb-1">{item.title}</h3>
                  <p className="text-xs text-brand-muted">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button
              as="a"
              href={`https://wa.me/${siteInfo.whatsapp.number}?text=${encodeURIComponent(siteInfo.whatsapp.message)}`}
              target="_blank"
              variant="primary"
              size="lg"
              className="shadow-neon hover:shadow-neon-lg px-10 py-4"
            >
              Falar no WhatsApp Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Catálogo Completo */}
      <section id="catalogo" className="py-16 lg:py-24 bg-black" aria-labelledby="catalogo-title">
        <div className="container-app">
          <div className="mb-10">
            <p className="font-mono text-brand-primary text-[10px] tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-brand-primary" aria-hidden="true" />
              Todos os produtos
            </p>
            <h2 id="catalogo-title" className="font-display text-3xl lg:text-4xl font-bold text-brand-text">
              Catálogo Completo
            </h2>
          </div>

          <ProductGrid limit={20} />
        </div>
      </section>

      {/* Sobre - Trust Builder (fechamento com credibilidade) */}
      <section id="sobre" className="py-16 lg:py-20 bg-brand-surface border-t border-brand-border" aria-labelledby="sobre-title">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <Zap size={32} className="text-brand-primary mx-auto mb-6" aria-hidden="true" />
            <h2 id="sobre-title" className="font-display text-2xl lg:text-3xl font-bold text-brand-text mb-6">
              Por que <span className="text-neon">{siteInfo.name}</span>?
            </h2>
            <p className="text-brand-muted text-base leading-relaxed mb-10">
              Somos uma vitrine digital curada. Cada produto passa por seleção técnica.
              Sem intermediários desnecessários — você fala direto conosco via WhatsApp e recebe atendimento humano, rápido e personalizado.
            </p>

            {/* Social proof */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              {[
                { num: '500+', label: 'Clientes atendidos' },
                { num: '98%', label: 'Satisfação' },
                { num: '24h', label: 'Resposta média' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-2xl font-bold text-brand-primary">{stat.num}</p>
                  <p className="font-mono text-xs text-brand-muted uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
