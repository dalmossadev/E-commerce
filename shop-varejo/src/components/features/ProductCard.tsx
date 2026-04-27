/**
 * @file src/components/features/ProductCard.tsx
 * @description Card de produto orientado a SKU.
 *
 * Recebe APENAS a prop `sku` e busca todos os dados no site-config.ts.
 *
 * Princípios SOLID:
 *   SRP — só exibe um produto
 *   OCP — novos campos no config sem alterar este componente
 *   DIP — depende da abstração (getProductBySku), não dos dados diretos
 *
 * GRACEFUL DEGRADATION:
 *   - SKU inexistente → estado visual "Produto Indisponível"
 *   - Imagem com erro → placeholder via ImageWithFallback
 *   - Fora de estoque → badge + botão desabilitado
 *   - Optional chaining em todos os campos
 */
'use client';

import { useState } from 'react';
import { ShoppingBag, AlertTriangle, ExternalLink, Info } from 'lucide-react';
import {
  getProductBySku,
  getProductImageUrl,
  getWhatsAppLink,
  formatPrice,
  calcDiscount,
} from '@/constants/site-config';
import { Button }             from '@/components/ui/Button';
import { Badge }              from '@/components/ui/Badge';
import { ImageWithFallback }  from '@/components/ui/ImageWithFallback';
import { cn }                 from '@/lib/utils';

// ── Props ──────────────────────────────────────────────────────────
type ProductCardProps = {
  product?: {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    originalPrice?: number;
    imageName: string;
    altText: string;
    category: string;
    badge?: string;
    inStock: boolean;
    specs?: Record<string, string>;
  };
  sku?: string;
  className?: string;
};

// ── Estados visuais de especificação ─────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-brand-border last:border-none">
      <span className="text-xs text-brand-muted font-mono">{label}</span>
      <span className="text-xs text-brand-text font-mono font-semibold">{value}</span>
    </div>
  );
}

// ── Graceful Degradation — SKU não encontrado ─────────────────────
function ProductNotFound({ sku }: { sku: string }) {
  return (
    <div
      role="alert"
      className="card flex flex-col items-center justify-center gap-3
                 p-8 text-center min-h-[320px]"
      aria-label={`Produto ${sku} indisponível`}
    >
      <AlertTriangle
        size={36}
        className="text-yellow-500 opacity-60"
        aria-hidden="true"
      />
      <p className="font-display text-sm text-brand-muted tracking-widest uppercase">
        Produto Indisponível
      </p>
      <p className="text-xs text-brand-muted/60 font-mono">
        SKU: {sku}
      </p>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────
export function ProductCard({ product: propProduct, sku, className }: ProductCardProps) {
  const [showSpecs, setShowSpecs] = useState(false);

  // Support both props.product (API) or sku (legacy config)
  const product = propProduct || (sku ? getProductBySku(sku) : null);

  // ── Graceful Degradation: produto não encontrado ─────────────────────
  if (!product) {
    return sku ? <ProductNotFound sku={sku} /> : null;
  }

  // Optional chaining em todos os acessos
  const name          = product?.name           ?? 'Produto';
  const description   = product?.description    ?? '';
  // API usa basePrice, config usa price
  const price         = product?.basePrice ?? (product as any)?.price ?? 0; 
  const originalPrice = product?.originalPrice;
  const imageName     = product?.imageName      ?? '';
  const altText       = product?.altText        ?? `Imagem de ${name}`;
  const badge         = product?.badge;
  const inStock       = product?.inStock        ?? false;
  const specs         = product?.specs;

  const discountPct   = originalPrice ? calcDiscount(originalPrice, price) : null;

  const waLink = getWhatsAppLink(
    `Olá! Tenho interesse no produto *${name}*. Pode me ajudar?`
  );

  return (
    <article
      className={cn('card group flex flex-col', className)}
      aria-label={name}
    >
      {/* ── Imagem ──────────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-brand-surface-2">
        <ImageWithFallback
          src={getProductImageUrl(imageName)}
          alt={altText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackLabel={`Imagem de ${name} indisponível`}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge type={badge} />
          </div>
        )}

        {/* Fora de estoque */}
        {!inStock && (
          <div
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-20"
            aria-label="Produto fora de estoque"
          >
            <span className="font-display text-sm text-brand-muted tracking-widest uppercase">
              Fora de Estoque
            </span>
          </div>
        )}

        {/* Desconto pill */}
        {discountPct && inStock && (
          <div className="absolute top-3 right-3 z-10">
            <span className="badge bg-red-500/90 text-white border-none text-xs">
              −{discountPct}%
            </span>
          </div>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* SKU */}
        <p className="font-mono text-xs text-brand-muted/60 tracking-widest">
          // {sku}
        </p>

        {/* Nome */}
        <h3 className="font-display text-base font-bold text-brand-text
                       leading-tight tracking-wide line-clamp-2">
          {name}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-brand-muted leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Preço */}
        <div className="flex items-baseline gap-2" aria-label={`Preço: ${formatPrice(price)}`}>
          <span className="font-mono text-xl font-bold text-brand-primary tracking-tight">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="font-mono text-sm text-brand-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Specs toggle */}
        {specs && Object.keys(specs).length > 0 && (
          <div>
            <button
              onClick={() => setShowSpecs(v => !v)}
              className="flex items-center gap-1.5 text-xs text-brand-muted
                         hover:text-brand-primary transition-colors font-mono"
              aria-expanded={showSpecs}
              aria-controls={`specs-${sku}`}
            >
              <Info size={12} aria-hidden="true" />
              {showSpecs ? 'Ocultar specs' : 'Ver especificações'}
            </button>

            {showSpecs && (
              <div
                id={`specs-${sku}`}
                className="mt-2 p-3 bg-brand-background/60 rounded-lg
                           border border-brand-border"
              >
                {Object.entries(specs).map(([k, v]) => (
                  <SpecRow key={k} label={k} value={v} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
          <Button
            as="a"
            href={waLink}
            target="_blank"
            variant="primary"
            size="sm"
            fullWidth
            disabled={!inStock}
            aria-disabled={!inStock}
            leftIcon={<ShoppingBag size={14} aria-hidden="true" />}
          >
            {inStock ? 'Comprar via WA' : 'Indisponível'}
          </Button>

          <Button
            as="a"
            href={waLink}
            target="_blank"
            variant="outline"
            size="sm"
            aria-label={`Ver detalhes de ${name} no WhatsApp`}
            leftIcon={<ExternalLink size={14} aria-hidden="true" />}
          >
            Detalhes
          </Button>
        </div>
      </div>
    </article>
  );
}
