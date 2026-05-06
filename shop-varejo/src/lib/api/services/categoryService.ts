import { Category } from '@/types/interfaces';

export const categoryService = {
  async list(type?: 'PRODUCT' | 'SUPPLIER'): Promise<Category[]> {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    
    const url = `/api/categories${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async create(data: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  }
};
