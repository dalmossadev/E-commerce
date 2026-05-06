'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full bg-white text-black z-[70] flex flex-col transition-transform duration-300 ease-in-out",
          "w-full sm:w-96",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight">Meu Carrinho</h2>
            {totalItems > 0 && (
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-none">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-none transition-colors"
            aria-label="Fechar carrinho"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-none flex items-center justify-center mb-2">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <p className="font-display text-gray-500 uppercase tracking-widest text-sm">Seu carrinho está vazio</p>
              <Button
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-black hover:text-white"
                onClick={onClose}
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.sku} className="flex gap-4 group">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-none overflow-hidden flex-shrink-0">
                    <Image
                      src={`/img/catalogo/${item.imageName}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold leading-tight line-clamp-1">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.sku)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label={`Remover ${item.name} do carrinho`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-mono text-gray-500 mt-1">
                        R$ {(item.price / 100).toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-black rounded-none">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-bold">
                        R$ {((item.price * item.quantity) / 100).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Total do pedido</p>
                <p className="text-2xl font-bold">R$ {(totalPrice / 100).toFixed(2).replace('.', ',')}</p>
              </div>
              <p className="text-xs text-gray-400 font-mono">{totalItems} itens</p>
            </div>
            
            <div className="space-y-3">
              <Button
                fullWidth
                size="lg"
                className="!bg-black !text-white hover:opacity-90 rounded-none h-14 uppercase tracking-widest font-display text-sm flex items-center justify-center gap-2 border-none"
                onClick={handleCheckout}
              >
                Finalizar Compra
                <ArrowRight size={16} />
              </Button>
              <button
                onClick={onClose}
                className="w-full text-center text-[10px] font-mono uppercase tracking-widest py-2 hover:underline"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
