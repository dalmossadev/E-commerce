/**
 * @file src/components/features/ProductCard.tsx
 * @description Card de produto — dados vindos da API (product prop) ou legacy (sku).
 *
 * Princípios SOLID:
 *   SRP — só exibe um produto
 *   OCP — novos campos no config sem alterar este componente
 *   DIP — depende da abstração, não dos dados diretos
 *
 * GRACEFUL DEGRADATION:
 *   - SKU inexistente → estado visual "Produto Indisponível"
 *   - Imagem com erro → placeholder via ImageWithFallback
 *   - Fora de estoque → badge + botão desabilitado
 *   - Optional chaining em todos os campos
 */
'use client';

import { useState, useEffect, useId } from 'react';
import { ShoppingBag, AlertTriangle, ExternalLink, Info, Heart, MapPin, Clock } from 'lucide-react';
import {
  getWhatsAppLink,
  calcDiscount,
} from '@/constants/site-config';
import { Button }             from '@/components/ui/Button';
import { Badge }              from '@/components/ui/Badge';
import { ImageWithFallback }  from '@/components/ui/ImageWithFallback';
import { cn }                 from '@/lib/utils';
import { useWishlist }        from '@/hooks/useWishlist';
import { useWishlistFlow }   from '@/hooks/useWishlistFlow';
import { LeadInterestModal }  from '@/components/LeadInterestModal';
import { WishlistQuickModal } from '@/components/WishlistQuickModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

// ── Props ──────────────────────────────────────────────────────────
type ProductCardProps = {
  product?: {
    id: number;
    name: string;
    description: string;
    basePrice: number;  // centavos — dividir por 100 para exibir
    originalPrice?: number;  // centavos
    imageName: string;
    altText: string;
    imageUrl?: string;  // URL completa vinda do backend
    categoryId: number;
    category?: { id: number; name: string; slug: string };
    badge?: string | null;
    inStock: boolean;
    featured?: boolean;
    specs?: Record<string, any>;
    sku?: string;
    variant?: {
      fulfillmentType?: string;
    };
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
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Support props.product (API data)
  const product = propProduct;
  const generatedId = useId();
  // SKU from variants if not at top level. Fallback to ID-based string to ensure uniqueness in cart if SKU is missing.
  const effectiveSku = product?.sku || (product as any)?.variants?.[0]?.sku || sku || `ID-${product?.id || generatedId.replace(/:/g, '')}`;

  const { handleHeartClick, isInWishlist, isModalOpen, closeModal, handleModalSuccess, currentProduct } = useWishlistFlow();
  const { user } = useAuth();
  const settings = useSettings();

  // ── Graceful Degradation: produto não encontrado ─────────────────────
  if (!product) {
    return null;
  }

  // Optional chaining em todos os acessos
  const name          = product?.name           ?? 'Produto';
  const description   = product?.description    ?? '';
  const basePrice    = product?.basePrice || (product as any)?.variants?.[0]?.price || 0;
  const displayPrice  = (basePrice / 100).toFixed(2);  // converte centavos para reais
  const originalPrice = product?.originalPrice || (product as any)?.originalPrice;
  const displayOriginal = originalPrice ? (originalPrice / 100).toFixed(2) : null;
  const imageName    = product?.imageName || '';
  const altText       = product?.altText        ?? `Imagem de ${name}`;
  const badge         = (product as any)?.badge;
  const inStock       = product?.inStock        ?? false;
  const specs         = (product as any)?.specs as Record<string, string> | undefined;

   // imageSrc: caminho relativo para o frontend servir as imagens da pasta public
   // imageName já vem com extensão do banco de dados
   const imageSrc = imageName
     ? `/img/catalogo/${imageName}`
     : '/img/catalogo/produto-default.webp';

  const discountPct   = originalPrice ? calcDiscount(originalPrice, basePrice) : null;

  const waLink = getWhatsAppLink(
    `Olá! Tenho interesse no produto *${name}* (SKU: ${effectiveSku || 'N/A'}). Pode me ajudar?`,
    { number: settings.whatsapp_number, message: settings.whatsapp_message }
  );

  const handleWhatsAppClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'WhatsApp',
        event_label: `Product: ${name} (${effectiveSku})`,
        value: basePrice,
      });
    }
  };

  return (
    <article
      className={cn('card group flex flex-col relative', className)}
      aria-label={name}
    >
        {/* ── Imagem ────────────────────────────────────────── */}
        <div className="relative aspect-square overflow-hidden bg-brand-surface-2">
          <ImageWithFallback
             src={imageSrc}
             alt={altText}
             fill
             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
             className="object-cover transition-transform duration-700 group-hover:scale-110"
             fallbackLabel={`Imagem de ${name} indisponível`}
           />

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 z-10" />

        {/* Badge - só exibe se badge não for null/undefined */}
        {badge && (
          <div className="absolute top-3 left-3 z-20">
            <Badge type={badge} />
          </div>
        )}

        {/* Pronta Entrega Badge (Task 04) */}
        {(product as any)?.variant?.fulfillmentType === 'IN_STOCK' && (
          <div className="absolute top-3 right-3 z-20">
            <span className="badge bg-brand-primary/90 text-brand-background border-none text-[10px] font-mono flex items-center gap-1">
              <MapPin size={10} aria-hidden="true" />
              Pronta Entrega
            </span>
          </div>
        )}

        {/* Desconto pill */}
        {discountPct && inStock && (
          <div className="absolute top-3 right-3 z-20">
            <span className="badge bg-red-500/90 text-white border-none text-xs font-mono shadow-lg">
              −{discountPct}%
            </span>
          </div>
        )}

        {/* Fora de estoque */}
        {!inStock && (
          <div
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
            aria-label="Produto fora de estoque"
          >
            <span className="font-display text-sm text-brand-muted tracking-widest uppercase">
              Fora de Estoque
            </span>
          </div>
        )}

        {/* Wishlist + Quick actions no hover */}
        {inStock && (
          <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (product?.id && product?.name) {
                      handleHeartClick({ 
                        id: product.id, 
                        name: product.name, 
                        sku: effectiveSku,
                        basePrice: basePrice,
                        imageName: imageName,
                        variants: (product as any).variants
                      });
                    }
                  }}
                  className="p-2 bg-black/80 backdrop-blur-sm hover:bg-brand-primary/20 transition-colors"
                  aria-label={isInWishlist(effectiveSku) ? 'Remover da wishlist' : 'Adicionar à wishlist'}
                >
                  <Heart
                    size={16}
                    className={isInWishlist(effectiveSku) ? 'fill-[#00FF00] text-[#00FF00]' : 'text-white'}
                  />
                </button>
          </div>
        )}

        {/* CTA overlay no hover */}
        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  as="a"
                  href={waLink}
                  target="_blank"
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="shadow-neon"
                  leftIcon={<ShoppingBag size={14} aria-hidden="true" />}
                  onClick={handleWhatsAppClick}
                >
                  Comprar via WA
                </Button>
          </div>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* SKU */}
        <p className="font-mono text-[10px] text-brand-muted/50 tracking-widest uppercase">
          {effectiveSku}
        </p>

        {/* Nome */}
        <h3 className="font-display text-sm font-bold text-brand-text
                       leading-tight tracking-wide line-clamp-2 group-hover:text-brand-primary transition-colors">
          {name}
        </h3>

        {/* Preço destacado */}
        <div className="flex items-baseline gap-2 mt-1" aria-label={`Preço: R$ ${displayPrice}`}>
          <span className="font-mono text-lg font-bold text-brand-primary tracking-tight">
            R$ {displayPrice}
          </span>
          {displayOriginal && (
            <span className="font-mono text-xs text-brand-muted/60 line-through">
              R$ {displayOriginal}
            </span>
          )}
          {discountPct && (
            <span className="font-mono text-[10px] text-red-500 font-bold">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Descrição resumida */}
        <p className="text-xs text-brand-muted leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Specs toggle compacto */}
        {specs && Object.keys(specs).length > 0 && (
          <div className="pt-1">
            <button
              onClick={() => setShowSpecs(v => !v)}
              className="flex items-center gap-1.5 text-[10px] text-brand-muted
                         hover:text-brand-primary transition-colors font-mono uppercase tracking-wider"
              aria-expanded={showSpecs}
              aria-controls={`specs-${effectiveSku}`}
            >
              <Info size={10} aria-hidden="true" />
              {showSpecs ? 'Ocultar' : 'Specs'}
            </button>

            {showSpecs && (
                 <div
                 id={`specs-${effectiveSku}`}
                 className="mt-2 p-2 bg-brand-background/60
                            border border-brand-border"
               >
                {Object.entries(specs).map(([k, v]) => (
                  <SpecRow key={k} label={k} value={v} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTAs sempre visíveis no mobile */}
        <div className="flex gap-2 mt-auto pt-2 sm:hidden">
          <Button
            as="a"
            href={waLink}
            target="_blank"
            variant="primary"
            size="sm"
            fullWidth
            aria-disabled={!inStock}
            leftIcon={<ShoppingBag size={14} aria-hidden="true" />}
          >
            {inStock ? 'Comprar' : 'Indisponível'}
          </Button>
        </div>

        {/* Lead Modal */}
        <LeadInterestModal
          sku={sku || ''}
          productName={name}
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
        />

        {/* Wishlist Quick Modal */}
        {currentProduct && (
          <WishlistQuickModal
            productName={currentProduct.name || ''}
            sku={effectiveSku}
            productId={currentProduct.id}
            variantId={currentProduct.variants?.[0]?.id}
            isOpen={isModalOpen}
            onClose={closeModal}
            onSuccess={handleModalSuccess}
            initialName={user?.name || ''}
            initialEmail={user?.email || ''}
          />
        )}
      </div>
    </article>
  );
}
