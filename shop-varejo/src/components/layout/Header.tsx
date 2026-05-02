/**
 * @file src/components/layout/Header.tsx
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';
import { useSiteInfo } from '@/hooks/useSiteInfo';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { siteInfo } = useSiteInfo();

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
                    ? 'bg-black/95 backdrop-blur-lg border-b border-brand-primary/30 shadow-neon-sm'
                    : 'bg-transparent'}`}
      role="banner"
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16 lg:h-20">

           {/* Logo */}
           <Link
             href="/"
             className="flex items-center gap-2 group"
             aria-label={`${siteInfo.name} — página inicial`}
           >
             <div className="relative">
               <Zap
                 size={22}
                 className="text-brand-primary group-hover:animate-neon-pulse relative z-10"
                 aria-hidden="true"
               />
               {scrolled && (
                 <div className="absolute inset-0 bg-brand-primary/20 blur-xl" aria-hidden="true" />
               )}
             </div>
             <span className="font-display font-bold text-base lg:text-lg tracking-widest
                              text-brand-text group-hover:text-neon transition-colors">
               {siteInfo.name}
             </span>
           </Link>

          {/* Nav desktop */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs lg:text-sm text-brand-muted hover:text-brand-primary
                           transition-all tracking-wider uppercase relative group/nav py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-brand-primary group-hover/nav:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

           {/* CTA desktop */}
           <div className="hidden md:flex items-center gap-3">
             <Button
               as="a"
               href={`https://wa.me/${siteInfo.whatsapp.number}?text=${encodeURIComponent(siteInfo.whatsapp.message)}`}
               target="_blank"
               variant="primary"
               size="sm"
               aria-label="Entrar em contato via WhatsApp"
               className="shadow-neon-sm hover:shadow-neon"
             >
               WhatsApp
             </Button>
           </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-brand-muted hover:text-brand-primary
                       transition-colors p-2 relative z-10"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative">
              {mobileOpen
                ? <X size={24} aria-hidden="true" />
                : <Menu size={24} aria-hidden="true" />}
            </div>
          </button>
        </div>
      </div>

           {/* Menu mobile */}
           {mobileOpen && (
             <nav
               id="mobile-menu"
               className="md:hidden bg-black/98 backdrop-blur-lg border-t border-brand-primary/30"
               aria-label="Menu mobile"
             >
               <div className="container-app py-6 flex flex-col gap-1">
                 {navLinks.map(link => (
                   <a
                     key={link.href}
                     href={link.href}
                     onClick={() => setMobileOpen(false)}
                     className="font-mono text-sm text-brand-muted hover:text-brand-primary
                                transition-colors tracking-wider uppercase py-3 px-4
                                hover:bg-brand-primary/10"
                   >
                     {link.label}
                   </a>
                 ))}
                 <div className="pt-4 px-4">
                   <Button
                     as="a"
                     href={`https://wa.me/${siteInfo.whatsapp.number}?text=${encodeURIComponent(siteInfo.whatsapp.message)}`}
                     target="_blank"
                     variant="primary"
                     size="sm"
                     fullWidth
                     className="shadow-neon-sm"
                   >
                     WhatsApp
                   </Button>
                 </div>
               </div>
             </nav>
           )}
    </header>
  );
}
