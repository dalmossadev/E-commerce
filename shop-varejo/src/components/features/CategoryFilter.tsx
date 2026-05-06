/**
 * @file src/components/features/CategoryFilter.tsx
 * @description Filtro de categorias — Dinâmico, carrega do backend.
 */
'use client';

import { useState, useEffect } from 'react';
import { categoryService } from '@/lib/api/services/categoryService';
import { Category } from '@/types/interfaces';
import { cn } from '@/lib/utils';

type CategoryFilterProps = {
  current: string; // slug ou 'todos'
  onChange: (slug: string) => void;
};

export function CategoryFilter({ current, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await categoryService.list('PRODUCT');
        setCategories(data);
      } catch (error) {
        console.error('Falha ao carregar categorias:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const allCategories = [
    { id: 0, name: 'Todos', slug: 'todos' },
    ...categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
  ];

  return (
    <div
      role="group"
      aria-label="Filtrar por categoria"
      className="flex items-center gap-2 flex-wrap"
    >
      <span className="font-mono text-xs text-brand-muted tracking-widest mr-2 hidden sm:inline">
        <span className="text-brand-primary">{'>'}</span> filtrar:
      </span>

      {loading ? (
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-20 h-8 bg-brand-surface animate-pulse" />
          ))}
        </div>
      ) : (
        allCategories.map(cat => {
          const active = current === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => onChange(cat.slug)}
              aria-pressed={active}
              aria-label={`Filtrar por ${cat.name}`}
              className={cn(
                'font-mono text-xs px-3 py-1.5',
                'border transition-all duration-200',
                'tracking-wider uppercase',
                active
                  ? 'border-brand-primary text-brand-primary bg-brand-primary/10 shadow-neon-sm'
                  : 'border-brand-border text-brand-muted bg-brand-surface/50 hover:border-brand-primary/50 hover:text-brand-text',
              )}
            >
              {cat.name}
            </button>
          );
        })
      )}
    </div>
  );
}
