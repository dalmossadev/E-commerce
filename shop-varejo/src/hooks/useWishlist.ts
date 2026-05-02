'use client';

import { useState, useEffect, useCallback } from 'react';

const WISHLIST_STORAGE_KEY = 'sisters-lab-wishlist';

function loadWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(skus: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(skus));
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(loadWishlist);

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  const toggleWishlist = useCallback((sku: string) => {
    setWishlist(prev => {
      if (prev.includes(sku)) {
        return prev.filter(item => item !== sku);
      }
      return [...prev, sku];
    });
  }, []);

  const isInWishlist = useCallback((sku: string) => {
    return wishlist.includes(sku);
  }, [wishlist]);

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
  };
}
