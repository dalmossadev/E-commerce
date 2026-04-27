/**
 * @file src/components/features/FloatingWhatsApp.tsx
 * @description Botão flutuante de WhatsApp.
 * Número e mensagem vindos do site-config.ts.
 */
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X }    from 'lucide-react';
import { SITE_INFO, getWhatsAppLink } from '@/constants/site-config';

export function FloatingWhatsApp() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Aparece após rolar 200px
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waLink = getWhatsAppLink();

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3
                  transition-all duration-500
                  ${visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}`}
      aria-live="polite"
    >
      {/* Tooltip expandido */}
      {expanded && (
        <div
          className="bg-brand-surface border border-brand-primary/30 rounded-2xl
                     p-4 max-w-[240px] shadow-neon-sm
                     animate-fade-up"
        >
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-2 right-2 text-brand-muted hover:text-brand-text"
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
          <p className="font-display text-xs text-brand-primary tracking-wider uppercase mb-1">
            Fale conosco
          </p>
          <p className="text-xs text-brand-muted mb-3 leading-relaxed">
            Dúvidas sobre produtos? Resposta em menos de 10 min!
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-primary text-brand-background
                       text-xs font-bold px-3 py-2 rounded-lg
                       hover:bg-brand-neon-dim transition-colors"
            aria-label="Abrir WhatsApp"
          >
            <MessageCircle size={14} aria-hidden="true" />
            Abrir WhatsApp
          </a>
        </div>
      )}

      {/* Botão principal */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="relative w-14 h-14 rounded-full
                   bg-brand-primary text-brand-background
                   flex items-center justify-center
                   shadow-neon animate-neon-pulse
                   hover:scale-110 active:scale-95
                   transition-transform duration-200
                   focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        aria-label={expanded ? 'Fechar chat WhatsApp' : 'Abrir chat WhatsApp'}
        aria-expanded={expanded}
      >
        <MessageCircle size={26} aria-hidden="true" />

        {/* Dot animado — "online" */}
        <span
          className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full
                     border-2 border-black animate-blink"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
