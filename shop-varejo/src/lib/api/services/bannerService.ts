import { API_BASE_URL } from '@/constants/site-config';
import { Banner } from '@/types/interfaces';

export const bannerService = {
  async list(): Promise<Banner[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/banners`);
    if (!response.ok) throw new Error('Falha ao buscar banners');
    return response.json();
  },

  async create(data: Partial<Banner>): Promise<Banner> {
    const response = await fetch(`${API_BASE_URL}/api/v1/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar banner');
    return response.json();
  },

  async update(id: string, data: Partial<Banner>): Promise<Banner> {
    const response = await fetch(`${API_BASE_URL}/api/v1/banners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar banner');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/banners/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir banner');
  },

  async uploadImage(id: string, type: 'desktop' | 'mobile', file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/api/v1/banners/${id}/image`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Erro ao fazer upload da imagem do banner');
    const data = await response.json();
    return data.imageUrl;
  }
};
