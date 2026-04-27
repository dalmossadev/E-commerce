/**
 * @file src/components/ui/Badge.tsx
 * @description Badge de status do produto.
 */
import { cn } from '@/lib/utils';
import type { ProductBadge } from '@/constants/site-config';

const BADGE_STYLES: Record<NonNullable<ProductBadge>, string> = {
  novo:      'bg-brand-primary/10 text-brand-primary border border-brand-primary/40',
  oferta:    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/40',
  exclusivo: 'bg-purple-500/10 text-purple-400 border border-purple-500/40',
  esgotando: 'bg-red-500/10 text-red-400 border border-red-500/40',
};

const BADGE_LABELS: Record<NonNullable<ProductBadge>, string> = {
  novo:      '◈ Novo',
  oferta:    '⚡ Oferta',
  exclusivo: '◇ Exclusivo',
  esgotando: '⚠ Esgotando',
};

type BadgeProps = {
  type:      NonNullable<ProductBadge>;
  className?: string;
};

export function Badge({ type, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        BADGE_STYLES[type],
        className
      )}
      aria-label={`Produto ${type}`}
    >
      {BADGE_LABELS[type]}
    </span>
  );
}
