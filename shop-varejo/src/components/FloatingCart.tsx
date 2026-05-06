'use client';

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { CartDrawer } from './CartDrawer';

export function FloatingCart() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center",
          "w-14 h-14 rounded-none bg-black border border-brand-primary/30",
          "shadow-lg shadow-brand-primary/10 transition-all duration-300",
          "hover:scale-110 active:scale-95 group"
        )}
        aria-label="Abrir carrinho"
      >
        <ShoppingBag className="w-6 h-6 text-brand-primary transition-colors" />
        
        {mounted && totalItems > 0 && (
          <span 
            className={cn(
              "absolute -top-1 -right-1 flex items-center justify-center",
              "min-w-[22px] h-[22px] px-1 rounded-none",
              "bg-[#00FF00] text-black text-[10px] font-bold font-mono",
              "border-2 border-black animate-in zoom-in duration-300"
            )}
          >
            {totalItems}
          </span>
        )}
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-none bg-brand-primary/5 blur-md -z-10 group-hover:bg-brand-primary/10 transition-all" />
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
