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
  basePrice?: number;
  imageName?: string;
  variants?: Array<{
    id: number;
    sku: string;
    fulfillmentType?: string;
  }>;
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
    toast.className = 'fixed bottom-4 right-4 z-50 bg-black text-white font-mono text-sm px-4 py-3 rounded-none shadow-lg animate-fade-up';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  const handleHeartClick = useCallback(async (product: Product) => {
    const sku = product.sku || '';

    // Se já está na wishlist, remove de ambos
    if (isInWishlist(sku)) {
      toggleWishlist(sku);
      removeItem(sku);
      showToast('Removido da lista de desejos e do carrinho');
      return;
    }

    // Tentar obter dados do lead do localStorage para automação
    const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('lead_phone') : null;
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('lead_name') : null;

    // Se temos os dados necessários (ou somos autenticados e temos o telefone salvo)
    if (savedPhone && (isAuthenticated || savedName)) {
      const name = user?.name || savedName || 'Cliente';
      const email = user?.email || '';
      
      const formData = new FormData();
      formData.append('sku', sku);
      formData.append('customerName', name);
      formData.append('customerPhone', savedPhone);
      if (email) formData.append('customerEmail', email);
      formData.append('productId', String(product.id));
      const variant = product.variants?.[0];
      const variantId = variant?.id;
      
      if (!variantId) {
        console.warn(`[WishlistFlow] Produto ${product.id} não possui variantes válidas.`, product);
        showToast('Erro: Este produto não pode ser adicionado ao carrinho no momento.');
        return;
      }

      try {
        await createLeadAction(formData);
        
        toggleWishlist(sku);
        addItem({
          id: product.id,
          variantId: variantId,
          name: product.name,
          price: product.basePrice || 0,
          imageName: product.imageName || '',
          sku: sku,
          quantity: 1,
          fulfillmentType: variant?.fulfillmentType
        });
        
        showToast('Adicionado à lista de desejos e ao carrinho!');
        return;
      } catch (error) {
        console.error('Erro ao criar lead automático:', error);
        // Fallback para o modal se falhar
      }
    }

    // Se não temos dados ou falhou, abre modal
    setCurrentProduct(product);
    setIsModalOpen(true);
  }, [isInWishlist, toggleWishlist, addItem, removeItem, isAuthenticated, user]);

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
      
      const variant = currentProduct.variants?.[0];
      
      if (!variant?.id) {
        console.warn(`[WishlistFlow] Produto ${currentProduct.id} não possui variantes válidas.`, currentProduct);
        showToast('Erro: Este produto não pode ser adicionado ao carrinho no momento.');
        closeModal();
        return;
      }
      
      addItem({
        id: currentProduct.id,
        variantId: variant.id,
        name: currentProduct.name,
        price: currentProduct.basePrice || 0,
        imageName: currentProduct.imageName || '',
        sku: sku,
        quantity: 1,
        fulfillmentType: variant.fulfillmentType
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
