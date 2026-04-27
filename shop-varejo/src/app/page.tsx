/**
 * @file src/app/page.tsx
 * @description Página principal — dados da API do backend.
 */

import type { Metadata } from 'next';
import { HeroBanner } from '@/components/features/HeroBanner';
import { FeaturedSection } from '@/components/features/FeaturedSection';
import { ProductGrid } from '@/components/features/ProductGrid';
import { SITE_INFO, getWhatsAppLink } from '@/constants/site-config';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Zap, Shield, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
  description: SITE_INFO.description,
};

export default function HomePage() {
  return (
    <>
      <HeroBanner bannerId="banner-principal" />
      <TrustBar />
      <FeaturedSection
        title="Destaques"
        eyebrow="// seleção_curada"
        subtitle="Os produtos mais pedidos da semana"
      />
      <section id="catalogo" aria-labelledby="catalogo-title">
        <div className="container-app py-20">
          <div className="mb-10">
            <p className="font-mono text-brand-primary text-xs tracking-[0.3em] uppercase mb-2">
              // catálogo_completo
            </p>
            <h2 id="catalogo-title" className="font-display text-3xl lg:text-4xl font-bold text-brand-text">
              Todos os Produtos
            </h2>
          </div>
          <ProductGrid limit={20} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

function TrustBar() {
  const items = [
    { icon: <Truck size={18} aria-hidden="true" />, text: 'Entrega rápida' },
    { icon: <Shield size={18} aria-hidden="true" />, text: 'Compra 100% segura' },
    { icon: <Zap size={18} aria-hidden="true" />, text: 'Atendimento imediato' },
    { icon: <MessageCircle size={18} aria-hidden="true" />, text: 'Suporte via WhatsApp' },
  ];

  return (
    <div className="bg-brand-surface border-y border-brand-border" aria-label="Diferenciais da loja">
      <div className="container-app py-4">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-brand-muted font-mono text-xs tracking-wide justify-center md:justify-start">
              <span className="text-brand-primary">{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-brand-surface border-y border-brand-border my-8" aria-labelledby="cta-title">
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(#00FF00 1px, transparent 1px), linear-gradient(90deg, #00FF00 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-96 h-32 bg-brand-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="relative container-app py-16 text-center">
        <p className="font-mono text-brand-primary text-xs tracking-[0.3em] uppercase mb-3">// fale_conosco</p>
        <h2 id="cta-title" className="font-display text-3xl lg:text-4xl font-bold text-brand-text mb-4">
          Dúvidas? <span className="text-neon">Respondemos em minutos.</span>
        </h2>
        <p className="text-brand-muted text-base mb-8 max-w-lg mx-auto">
          Nossa equipe está no WhatsApp agora. Tire dúvidas, veja fotos adicionais e feche seu pedido com segurança.
        </p>
        <Button as="a" href={getWhatsAppLink()} target="_blank" variant="primary" size="lg" leftIcon={<MessageCircle size={18} aria-hidden="true" />} aria-label="Abrir conversa no WhatsApp">
          Falar no WhatsApp
        </Button>
      </div>
    </section>
  );
}