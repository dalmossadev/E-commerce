// src/modules/lead-controller.ts
import { LeadStatus } from '../types/interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const ENDPOINT = `${API_BASE_URL}/api/v1/leads`;

export interface CreateLeadDTO {
  sku: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  productId?: number;
  variantId?: number;
  notes?: string;
}

export interface UpdateLeadDTO {
  status?: LeadStatus;
  notes?: string;
}

export interface LeadQueryDTO {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  sku?: string;
  search?: string;
}

export interface LeadResponseDTO {
  id: number;
  sku: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: LeadStatus;
  notes?: string;
  productId?: number;
  variantId?: number;
  createdAt: string;
  updatedAt: string;
}

export class LeadManager {
  async getAll(query?: LeadQueryDTO): Promise<LeadResponseDTO[]> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const url = params.toString() ? `${ENDPOINT}?${params}` : ENDPOINT;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar leads');
    return response.json();
  }

  async getById(id: number): Promise<LeadResponseDTO | null> {
    const response = await fetch(`${ENDPOINT}/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erro ao buscar lead');
    return response.json();
  }

  async create(data: CreateLeadDTO): Promise<LeadResponseDTO> {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = 'Erro ao criar lead';
      try {
        const errorData = JSON.parse(errorBody);
        errorMessage = errorData.errors?.[0]?.message || errorData.message || errorMessage;
        
      } catch {
        errorMessage = errorBody || errorMessage;
      }
      throw new Error(errorMessage);
    }
  
    return response.json();
  }

  async update(id: number, data: UpdateLeadDTO): Promise<LeadResponseDTO> {
    const response = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar lead');
    return response.json();
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
}
