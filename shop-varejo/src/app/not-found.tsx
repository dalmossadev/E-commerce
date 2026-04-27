/**
 * @file src/app/not-found.tsx
 * @description Página 404 — tema Neon.
 * Exibida automaticamente pelo Next.js quando a rota não existe.
 */

import type { Metadata } from 'next';
import Link   from 'next/link';
import { Home, MessageCircle, Search } from 'lucide-react';
import { Button }      from '@/components/ui/Button';
import { SITE_INFO, getWhatsAppLink } from '@/constants/site-config';

export const metadata: Metadata = {
  title:  '404 — Página não encontrada',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-brand-background flex items-center justify-center
                 px-4 relative overflow-hidden"
      role="main"
      aria-labelledby="notfound-title"
    >

      {/* Grid de fundo */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(#00FF00 1px, transparent 1px), ' +
            'linear-gradient(90deg, #00FF00 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow central */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[500px] h-[300px] bg-brand-primary/5 rounded-full
                   blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative z-10 text-center max-w-xl">

        {/* Número 404 */}
        <div
          className="font-display font-bold leading-none select-none mb-6"
          aria-hidden="true"
        >
          <span
            className="block text-[8rem] sm:text-[12rem] text-brand-primary
                       drop-shadow-[0_0_40px_rgba(0,255,0,0.4)]"
          >
            404
          </span>
        </div>

        {/* Mensagem */}
        <p className="font-mono text-brand-primary text-xs tracking-[0.3em]
                      uppercase mb-3">
          // rota_não_encontrada
        </p>

        <h1
          id="notfound-title"
          className="font-display text-2xl sm:text-3xl font-bold
                     text-brand-text mb-4"
        >
          Esta página não existe.
        </h1>

        <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-10">
          O endereço que você acessou não foi encontrado em{' '}
          <span className="text-brand-primary font-mono">{SITE_INFO.name}</span>.
          Verifique o link ou volte para a loja.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            as="a"
            href="/"
            variant="primary"
            size="md"
            leftIcon={<Home size={16} aria-hidden="true" />}
          >
            Voltar para a loja
          </Button>

          <Button
            as="a"
            href="/#catalogo"
            variant="outline"
            size="md"
            leftIcon={<Search size={16} aria-hidden="true" />}
          >
            Ver catálogo
          </Button>

          <Button
            as="a"
            href={getWhatsAppLink('Olá! Preciso de ajuda para encontrar um produto.')}
            target="_blank"
            variant="ghost"
            size="md"
            leftIcon={<MessageCircle size={16} aria-hidden="true" />}
          >
            Falar no WA
          </Button>
        </div>

        {/* Rodapé */}
        <p className="font-mono text-brand-muted/40 text-xs mt-12 tracking-widest">
          {SITE_INFO.name} · error_code: 404 · page_not_found
        </p>
      </div>
    </div>
  );
}
