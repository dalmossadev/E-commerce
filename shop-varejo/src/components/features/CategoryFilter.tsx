/**
 * @file src/components/features/CategoryFilter.tsx
 * @description Filtro de categorias — Client Component.
 * Filtra os produtos exibidos sem redirecionar (estado local).
 */
'use client';

import { CATEGORIES, type ProductCategory } from '@/constants/site-config';
import { cn } from '@/lib/utils';

type CategoryFilterProps = {
  current:   ProductCategory | 'todos';
  onChange:  (cat: ProductCategory | 'todos') => void;
};

export function CategoryFilter({ current, onChange }: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por categoria"
      className="flex items-center gap-2 flex-wrap"
    >
      <span className="font-mono text-xs text-brand-muted tracking-widest mr-2 hidden sm:inline">
        <span className="text-brand-primary">{'>'}</span> filtrar:
      </span>

      {CATEGORIES.map(cat => {
        const active = current === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            aria-pressed={active}
            aria-label={`Filtrar por ${cat.label}`}
            className={cn(
              'font-mono text-xs px-3 py-1.5',
              'border transition-all duration-200',
              'tracking-wider uppercase',
              active
                ? 'border-brand-primary text-brand-primary bg-brand-primary/10 shadow-neon-sm'
                : 'border-brand-border text-brand-muted bg-brand-surface/50 hover:border-brand-primary/50 hover:text-brand-text',
            )}
          >
            <span aria-hidden="true">{cat.icon} </span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
