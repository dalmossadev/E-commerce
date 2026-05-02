'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from './useWishlist';
import { useCart } from '@/contexts/CartContext';
import { createLeadAction } from '@/actions/lead.actions';

interface Product {
  id: number;
  name: string;
  sku?: string;
  price?: number;
  imageName?: string;
}

export function useWishlistFlow() {
  const { user, isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem, removeItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Toast function definida localmente
  function showToast(message: string) {
    if (typeof window === 'undefined') return;

    const toast = document.createElement('div');
    toast.role = 'status';
    toast.ariaLive = 'polite';
    toast.className = 'fixed bottom-4 right-4 z-50 bg-black text-white font-mono text-sm px-4 py-3 rounded shadow-lg animate-fade-up';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  const handleHeartClick = useCallback((product: Product) => {
    const sku = product.sku || '';

    // Se já está na wishlist, remove de ambos
    if (isInWishlist(sku)) {
      toggleWishlist(sku);
      removeItem(sku);
      showToast('Removido da lista de desejos e do carrinho');
      return;
    }

    // Se autenticado, adiciona direto
    if (isAuthenticated) {
      toggleWishlist(sku);
      addItem({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        imageName: product.imageName || '',
        sku: sku,
        quantity: 1
      });
      showToast('Adicionado à lista de desejos e ao carrinho!');
      return;
    }

    // Se não autenticado, abre modal
    setCurrentProduct(product);
    setIsModalOpen(true);
  }, [isInWishlist, toggleWishlist, addItem, removeItem, isAuthenticated]);

  async function createLeadWithData(product: Product, customerName: string, customerPhone: string, customerEmail: string = '') {
    const formData = new FormData();
    formData.append('sku', product.sku || '');
    formData.append('customerName', customerName);
    formData.append('customerPhone', customerPhone);
    if (customerEmail) formData.append('customerEmail', customerEmail);
    formData.append('productId', String(product.id));

    const result = await createLeadAction(formData);

    if (result.success) {
      toggleWishlist(product.sku || '');
      showToast('Produto adicionado à lista de desejos!');
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setCurrentProduct(null);
  }

  function handleModalSuccess() {
    if (currentProduct) {
      const sku = currentProduct.sku || '';
      toggleWishlist(sku);
      addItem({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price || 0,
        imageName: currentProduct.imageName || '',
        sku: sku,
        quantity: 1
      });
      showToast('Adicionado à lista de desejos e ao carrinho!');
    }
    closeModal();
  }

  return {
    handleHeartClick,
    isInWishlist,
    isModalOpen,
    closeModal,
    handleModalSuccess,
    currentProduct,
    showToast,
  };
}
