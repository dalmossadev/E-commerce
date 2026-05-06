import { API_BASE_URL } from '@/constants/site-config';
import { Product, PaginatedResult } from '@/types/interfaces';

export const productService = {
  async list(options: { page?: number; limit?: number; category?: string; search?: string; featured?: boolean } = {}): Promise<PaginatedResult<Product>> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.category) params.append('category', options.category);
    if (options.search) params.append('search', options.search);
    if (options.featured !== undefined) params.append('featured', options.featured.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/products?${params.toString()}`);
    if (!response.ok) throw new Error('Falha ao buscar produtos');
    return response.json();
  },

  async getBySku(sku: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${sku}`);
    if (!response.ok) throw new Error('Produto não encontrado');
    return response.json();
  },

  async create(data: any): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar produto');
    }
    return response.json();
  },

  async update(sku: string, data: any): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${sku}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar produto');
    }
    return response.json();
  },

  async delete(sku: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${sku}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir produto');
  },

  async uploadImage(sku: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/products/${sku}/image`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Erro ao fazer upload da imagem');
    const data = await response.json();
    return data.imageUrl;
  }
};
