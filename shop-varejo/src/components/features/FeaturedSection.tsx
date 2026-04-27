/**
 * @file src/components/features/FeaturedSection.tsx
 * @description Seção de produtos em destaque — dados da API.
 */
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

interface Product {
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
  featured: boolean;
  specs?: Record<string, string>;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type FeaturedSectionProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  id?: string;
  limit?: number;
};

export function FeaturedSection({
  title,
  eyebrow,
  subtitle,
  id = 'destaques',
  limit = 4,
}: FeaturedSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products?featured=true&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch');

        const data: ProductsResponse = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, [limit]);

  if (loading || error || products.length === 0) {
    return null;
  }

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-20">
      <div className="container-app">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            {eyebrow && (
              <p className="font-mono text-brand-primary text-xs tracking-[0.3em] uppercase mb-2 flex items-center gap-3">
                <span className="h-px w-8 bg-brand-primary" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            <h2 id={`${id}-title`} className="font-display text-3xl lg:text-4xl font-bold text-brand-text">
              {title}
            </h2>
            {subtitle && (
              <p className="text-brand-muted mt-2">{subtitle}</p>
            )}
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {products.map((product, i) => (
            <li key={product.id} role="listitem" style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-up">
              <ProductCard product={product} className="h-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}