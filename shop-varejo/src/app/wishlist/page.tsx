'use client';

import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { ProductCard } from '@/components/features/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { useWishlistFlow } from '@/hooks/useWishlistFlow';
import { WishlistQuickModal } from '@/components/WishlistQuickModal';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { isModalOpen, closeModal, handleModalSuccess, currentProduct } = useWishlistFlow();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        // Busca todos os produtos da API
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        const data = await response.json();
        
        // Filtra apenas os que estão na wishlist
        const wishlisted = data.data.filter((p: any) => wishlist.includes(p.sku));
        setProducts(wishlisted);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [wishlist]);

  function handleRemove(sku: string, e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(sku);
    setProducts(prev => prev.filter(p => p.sku !== sku));
    showToast('Produto removido da lista de desejos');
  }

  if (loading) {
    return (
      <main className="container-app py-20">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-40 bg-brand-surface" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container-app py-20">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-brand-text flex items-center gap-3">
          <Heart size={28} className="text-brand-primary" />
          Lista de Desejos
        </h1>
        <p className="text-brand-muted mt-2">
          {products.length} produto{products.length !== 1 ? 's' : ''} na sua lista
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <p className="font-display text-lg text-brand-muted">
            Sua lista de desejos está vazia
          </p>
          <Button
            as="a"
            href="/produtos"
            variant="primary"
            className="mt-6"
          >
            Ver Produtos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} className="h-full" />
              <button
                onClick={(e) => handleRemove(product.sku, e)}
                className="absolute top-2 right-2 z-30 p-2 bg-black/80
                           opacity-0 group-hover:opacity-100 transition-all duration-300
                           hover:bg-red-500/20"
                aria-label="Remover da wishlist"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Wishlist Quick Modal */}
      {currentProduct && (
        <WishlistQuickModal
          productName={currentProduct.name || ''}
          sku={currentProduct.sku || ''}
          productId={currentProduct.id}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </main>
  );
}

// Toast simples
function showToast(message: string) {
  if (typeof window === 'undefined') return;

  const toast = document.createElement('div');
  toast.role = 'status';
  toast.ariaLive = 'polite';
  toast.className = 'fixed bottom-4 right-4 z-50 bg-black text-white font-mono text-sm px-4 py-3 shadow-lg animate-fade-up';
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
