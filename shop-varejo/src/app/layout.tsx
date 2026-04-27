/**
 * @file src/app/layout.tsx
 * @description RootLayout — shell compartilhado por todas as páginas.
 *
 * Responsabilidades:
 *   - Metadata global (SEO + OpenGraph + robots)
 *   - Import do globals.css
 *   - Variáveis de fonte via CSS custom properties
 *   - FloatingWhatsApp global
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header }           from '@/components/layout/Header';
import { Footer }           from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/features/FloatingWhatsApp';
import { SITE_INFO }        from '@/constants/site-config';
import { ClientProviders }  from '@/components/providers/ClientProviders';

// ── Metadata ──────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  `${SITE_INFO.name} — ${SITE_INFO.tagline}`,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords:    ['e-commerce', 'compras', 'produtos', 'whatsapp', 'varejo', 'brasil'],
  authors:     [{ name: SITE_INFO.name }],
  openGraph: {
    type:        'website',
    locale:      'pt_BR',
    siteName:    SITE_INFO.name,
    title:       SITE_INFO.name,
    description: SITE_INFO.description,
  },
  robots: { index: true, follow: true },
  // A11Y: não bloqueia zoom do usuário
  other: { 'format-detection': 'telephone=no' },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  userScalable: true, // A11Y: nunca bloquear zoom
  themeColor:   '#000000',
};

// ── Layout ────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-brand-background text-brand-text font-body antialiased">

        {/* Header fixo — todas as páginas */}
        <Header />

        {/* Conteúdo principal */}
        <main id="main-content" tabIndex={-1}>
          <ClientProviders>
            {children}
          </ClientProviders>
        </main>

        {/* Footer — todas as páginas */}
        <Footer />

        {/* Botão flutuante WhatsApp — global */}
        <FloatingWhatsApp />

        {/* Skip link — A11Y: navegação por teclado */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                     focus:z-[9999] focus:px-4 focus:py-2
                     focus:bg-brand-primary focus:text-brand-background
                     focus:font-bold focus:rounded-lg focus:text-sm"
        >
          Pular para o conteúdo
        </a>
      </body>
    </html>
  );
}
