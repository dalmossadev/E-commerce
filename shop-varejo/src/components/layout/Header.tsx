/**
 * @file src/components/layout/Header.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';
import { SITE_INFO, getWhatsAppLink } from '@/constants/site-config';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#catalogo',   label: 'Catálogo'   },
    { href: '#destaques',  label: 'Destaques'  },
    { href: '#sobre',      label: 'Sobre'      },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${scrolled
                    ? 'bg-black/90 backdrop-blur-md border-b border-brand-border'
                    : 'bg-transparent'}`}
      role="banner"
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label={`${SITE_INFO.name} — página inicial`}
          >
            <Zap
              size={20}
              className="text-brand-primary group-hover:animate-neon-pulse"
              aria-hidden="true"
            />
            <span className="font-display font-bold text-lg tracking-widest
                             text-brand-text group-hover:text-neon transition-colors">
              {SITE_INFO.name}
            </span>
          </Link>

          {/* Nav desktop */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-sm text-brand-muted hover:text-brand-primary
                           transition-colors tracking-wider uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              as="a"
              href={getWhatsAppLink()}
              target="_blank"
              variant="outline"
              size="sm"
              aria-label="Entrar em contato via WhatsApp"
            >
              WhatsApp
            </Button>
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-brand-muted hover:text-brand-primary
                       transition-colors p-2"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen
              ? <X size={24} aria-hidden="true" />
              : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-brand-surface border-t border-brand-border"
          aria-label="Menu mobile"
        >
          <div className="container-app py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm text-brand-muted hover:text-brand-primary
                           transition-colors tracking-wider uppercase py-2"
              >
                {link.label}
              </a>
            ))}
            <Button
              as="a"
              href={getWhatsAppLink()}
              target="_blank"
              variant="primary"
              size="sm"
              fullWidth
            >
              WhatsApp
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
