/**
 * @file src/components/features/ProductGrid.tsx
 * @description Grid de produtos com filtro de categoria — dados da API.
 */
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';

import { Product } from '@/types/interfaces';

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ProductGridProps = {
  limit?: number;
};

export function ProductGrid({ limit = 20 }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        if (activeCategory !== 'todos') {
          params.set('category', activeCategory);
        }

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch');

        const data: ProductsResponse = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [limit, activeCategory]);

  return (
    <div>
      {/* Filtros */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CategoryFilter current={activeCategory as any} onChange={setActiveCategory} />
        <p className="font-mono text-[10px] text-brand-muted/60 uppercase tracking-wider" aria-live="polite">
          {!loading && !error && `${products.length} produto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Estados */}
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={() => setActiveCategory(activeCategory)} />}
      {!loading && !error && products.length === 0 && (
        <EmptyState category={activeCategory} onReset={() => setActiveCategory('todos')} />
      )}

      {/* Grid otimizado para conversão */}
      {!loading && !error && products.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5" role="list">
          {products.map((product, i) => (
            <li key={product.id} role="listitem" style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-up">
              <ProductCard product={product} className="h-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
           <div className="bg-brand-surface h-80" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <p className="font-mono text-red-500 text-sm">Erro: {message}</p>
      <button onClick={onRetry} className="font-mono text-xs text-brand-primary underline">
        Tentar novamente
      </button>
    </div>
  );
}

function EmptyState({ category, onReset }: { category: string; onReset: () => void }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="font-mono text-6xl text-brand-muted/20 select-none" aria-hidden="true">[ ]</div>
      <p className="font-display text-brand-muted text-sm tracking-widest uppercase">Nenhum produto em "{category}"</p>
      <button onClick={onReset} className="font-mono text-xs text-brand-primary underline underline-offset-4 hover:text-brand-neon-dim transition-colors">
        Ver todos os produtos
      </button>
    </div>
  );
}