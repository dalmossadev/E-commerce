/**
 * @file src/components/ui/Badge.tsx
 * @description Badge genérico com suporte a variantes e crianças.
 */
import { cn } from '@/lib/utils';
import type { ProductBadge } from '@/types/interfaces';

const BADGE_STYLES: Record<string, string> = {
  novo:      'bg-brand-primary/10 text-brand-primary border border-brand-primary/40',
  oferta:    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/40',
  exclusivo: 'bg-purple-500/10 text-purple-400 border border-purple-500/40',
  esgotando: 'bg-red-500/10 text-red-400 border border-red-500/40',
  lancamento: 'bg-green-500/10 text-green-400 border border-green-500/40',
  success:   'bg-green-500/10 text-green-500 border border-green-500/20',
  outline:   'bg-transparent text-brand-muted border border-brand-border',
  danger:    'bg-red-500/10 text-red-500 border border-red-500/20',
};

const BADGE_LABELS: Record<string, string> = {
  novo:      '◈ Novo',
  oferta:    '⚡ Oferta',
  exclusivo: '◇ Exclusivo',
  esgotando: '⚠ Esgotando',
  lancamento: '🚀 Lançamento',
};

export type BadgeProps = {
  type?:      ProductBadge | string;
  variant?:   'success' | 'outline' | 'danger' | string;
  className?: string;
  children?:  React.ReactNode;
};

export function Badge({ type, variant, className, children }: BadgeProps) {
  const styleKey = variant || type || 'outline';
  
  return (
    <span
      className={cn(
        'badge px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest inline-flex items-center justify-center',
        BADGE_STYLES[styleKey] || BADGE_STYLES.outline,
        className
      )}
      aria-label={type ? `Produto ${type}` : undefined}
    >
      {children || (type ? BADGE_LABELS[type as string] : null)}
    </span>
  );
}
