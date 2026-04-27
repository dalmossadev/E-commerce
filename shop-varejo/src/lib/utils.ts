/**
 * @file src/lib/utils.ts
 * @description Utilitários globais.
 */

/** Combina classes Tailwind de forma segura (substitui clsx + twMerge) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Formata centavos para Real Brasileiro */
export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(cents / 100);
}
