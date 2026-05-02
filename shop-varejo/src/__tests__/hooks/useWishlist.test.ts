import { renderHook, act } from '@testing-library/react';
import { useWishlist } from '@/hooks/useWishlist';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useWishlist', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should start with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist());
    expect(result.current.wishlist).toEqual([]);
  });

  it('should load wishlist from localStorage', () => {
    window.localStorage.setItem('sisters-lab-wishlist', JSON.stringify(['SKU-1', 'SKU-2']));
    const { result } = renderHook(() => useWishlist());
    expect(result.current.wishlist).toEqual(['SKU-1', 'SKU-2']);
  });

  it('should toggle wishlist item', () => {
    const { result } = renderHook(() => useWishlist());

    act(() => {
      result.current.toggleWishlist('SKU-1');
    });

    expect(result.current.wishlist).toContain('SKU-1');
    expect(result.current.isInWishlist('SKU-1')).toBe(true);

    act(() => {
      result.current.toggleWishlist('SKU-1');
    });

    expect(result.current.wishlist).not.toContain('SKU-1');
    expect(result.current.isInWishlist('SKU-1')).toBe(false);
  });

  it('should add multiple items to wishlist', () => {
    const { result } = renderHook(() => useWishlist());

    act(() => {
      result.current.toggleWishlist('SKU-1');
      result.current.toggleWishlist('SKU-2');
      result.current.toggleWishlist('SKU-3');
    });

    expect(result.current.wishlist).toHaveLength(3);
    expect(result.current.wishlist).toContain('SKU-1');
    expect(result.current.wishlist).toContain('SKU-2');
    expect(result.current.wishlist).toContain('SKU-3');
  });

  it('should save wishlist to localStorage when changed', () => {
    const { result } = renderHook(() => useWishlist());

    act(() => {
      result.current.toggleWishlist('SKU-1');
    });

    const saved = JSON.parse(window.localStorage.getItem('sisters-lab-wishlist') || '[]');
    expect(saved).toContain('SKU-1');
  });

  it('should not duplicate items in wishlist', () => {
    const { result } = renderHook(() => useWishlist());

    act(() => {
      result.current.toggleWishlist('SKU-1');
      result.current.toggleWishlist('SKU-1');
      result.current.toggleWishlist('SKU-1');
    });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist).toContain('SKU-1');
  });
});
