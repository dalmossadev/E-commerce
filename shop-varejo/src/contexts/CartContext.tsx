'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id?: number;           // Product ID
  variantId?: number;    // Variant ID
  sku: string;
  name: string;          // Simplified name
  productName?: string;  // Keep for compatibility
  color?: string;
  size?: string;
  quantity: number;
  price: number;         // unitPrice in centavos
  unitPrice?: number;    // Keep for compatibility
  imageName: string;
  fulfillmentType?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalPrice: number; // Alias for subtotal
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sisters-lab-cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loaded = loadCart();
    setItems(loaded);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveCart(items);
    }
  }, [items, isInitialized]);

  const addItem = (newItem: CartItem) => {
    // Fill compatibility fields if missing
    if (!newItem.productName) newItem.productName = newItem.name;
    if (!newItem.unitPrice) newItem.unitPrice = newItem.price;
    if (newItem.variantId) newItem.variantId = Number(newItem.variantId);
    if (newItem.id) newItem.id = Number(newItem.id);

    setItems(prev => {
      const existing = prev.find(item => item.sku === newItem.sku);
      if (existing) {
        return prev.map(item =>
          item.sku === newItem.sku
            ? { 
                ...item, 
                quantity: item.quantity + newItem.quantity,
                price: (item.price === 0 || !item.price) ? newItem.price : item.price,
                unitPrice: (item.unitPrice === 0 || !item.unitPrice) ? newItem.unitPrice : item.unitPrice
              }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (sku: string) => {
    setItems(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(sku);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.sku === sku ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice ?? item.price) * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        subtotal, 
        totalPrice: subtotal,
        totalItems 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
