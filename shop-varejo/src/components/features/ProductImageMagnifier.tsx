/**
 * @file src/components/features/ProductImageMagnifier.tsx
 * @description Componente de Lupa (Magnifier) HD para acessibilidade visual.
 * Segue diretrizes: agent-ux (A11Y WCAG 2.1) + agent-ui (P&B + Verde Neon).
 *
 * Funcionalidades:
 * - Zoom HD ao passar o mouse (desktop) ou tocar (mobile)
 * - Navegação por teclado (Tab para focar, Enter/Espaço para ativar lupa)
 * - ARIA attributes completos
 * - Cores estritamente P&B + Neon #00FF00
 */
'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type ProductImageMagnifierProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  quality?: number;
};

export function ProductImageMagnifier({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  quality = 85,
}: ProductImageMagnifierProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLevel = 2.5;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  }, []);

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsZoomed((prev) => !prev);
    }
    if (e.key === 'Escape' && isZoomed) {
      setIsZoomed(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-brand-surface-2',
        'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="img"
      aria-label={`${alt}. Pressione Enter para ativar lupa de zoom.`}
      aria-describedby="magnifier-instructions"
    >
      {/* Instruções para leitores de tela */}
      <span id="magnifier-instructions" className="sr-only">
        Imagem com lupa interativa. Use o mouse ou teclado para ampliar detalhes do produto.
      </span>

      {/* Imagem principal */}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          className={cn(
            'object-cover transition-transform duration-300',
            isZoomed ? 'scale-105' : 'scale-100'
          )}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 500}
          height={height || 500}
          quality={quality}
          className={cn(
            'object-cover transition-transform duration-300',
            isZoomed ? 'scale-105' : 'scale-100'
          )}
        />
      )}

      {/* Lupa / Zoom overlay */}
      {isZoomed && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          aria-hidden="true"
        >
          {/* Área do zoom */}
          <div
            className="absolute inset-0 bg-brand-background/90"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${100 * zoomLevel}%`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Borda indicativa de zoom ativo */}
          <div className="absolute inset-0 border-2 border-brand-primary/50" />
        </div>
      )}

      {/* Indicador visual de zoom ativo (acessível) */}
      {isZoomed && (
        <div
          className="absolute top-3 right-3 z-30 bg-brand-primary/90 text-brand-background
                     px-2 py-1 text-[10px] font-mono uppercase tracking-wider"
          aria-live="polite"
        >
          Zoom Ativo
        </div>
      )}
    </div>
  );
}
