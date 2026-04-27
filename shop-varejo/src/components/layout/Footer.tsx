/**
 * @file src/components/layout/Footer.tsx
 */
import { Zap } from 'lucide-react';
import { SITE_INFO, getWhatsAppLink } from '@/constants/site-config';

export function Footer() {
  return (
    <footer
      className="bg-brand-surface border-t border-brand-border mt-24"
      role="contentinfo"
    >
      <div className="container-app py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo + tagline */}
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-brand-primary" aria-hidden="true" />
            <div>
              <p className="font-display font-bold text-brand-text tracking-widest">
                {SITE_INFO.name}
              </p>
              <p className="text-xs text-brand-muted font-mono">
                {SITE_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Links do rodapé" className="flex gap-6">
            {[
              { href: '#catalogo', label: 'Catálogo' },
              { href: getWhatsAppLink(), label: 'WhatsApp', external: true },
              { href: SITE_INFO.social.instagram, label: 'Instagram', external: true },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="font-mono text-xs text-brand-muted hover:text-brand-primary
                           transition-colors tracking-wider uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-border
                        flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-brand-muted/50">
            © {new Date().getFullYear()} {SITE_INFO.name} · Todos os direitos reservados
          </p>
          <p className="font-mono text-xs text-brand-muted/40">
            Config-Driven · Next.js 14 · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
