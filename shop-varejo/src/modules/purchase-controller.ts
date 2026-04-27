// src/modules/purchase-controller.ts
import { PurchaseStatus } from '../types/interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const ENDPOINT = `${API_BASE_URL}/api/v1/purchases`;

export interface CreatePurchaseItemDTO {
  variantId: number;
  sku: string;
  productName: string;
  color?: string;
  size?: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseDTO {
  supplierId: number;
  supplierName: string;
  items: CreatePurchaseItemDTO[];
  notes?: string;
  expectedDeliveryDate?: string;
}

export interface UpdatePurchaseDTO {
  status?: PurchaseStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface ReceiveInventoryItemDTO {
  variantId: number;
  quantity: number;
}

export interface ReceiveInventoryDTO {
  items: ReceiveInventoryItemDTO[];
}

export interface PurchaseQueryDTO {
  page?: number;
  limit?: number;
  status?: PurchaseStatus;
  supplierId?: number;
}

export interface PurchaseResponseDTO {
  id: number;
  supplierId: number;
  supplierName: string;
  items: Array<{
    id: number;
    variantId: number;
    sku: string;
    productName: string;
    color?: string;
    size?: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  status: PurchaseStatus;
  trackingNumber?: string;
  notes?: string;
  expectedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export class PurchaseManager {
  async getAll(query?: PurchaseQueryDTO): Promise<PurchaseResponseDTO[]> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const url = params.toString() ? `${ENDPOINT}?${params}` : ENDPOINT;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar compras');
    return response.json();
  }

  async getById(id: number): Promise<PurchaseResponseDTO | null> {
    const response = await fetch(`${ENDPOINT}/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erro ao buscar compra');
    return response.json();
  }

  async create(data: CreatePurchaseDTO): Promise<PurchaseResponseDTO> {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar ordem de compra');
    return response.json();
  }

  async update(id: number, data: UpdatePurchaseDTO): Promise<PurchaseResponseDTO> {
    const response = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar ordem de compra');
    return response.json();
  }

  async receiveInventory(id: number, data: ReceiveInventoryDTO): Promise<PurchaseResponseDTO> {
    const response = await fetch(`${ENDPOINT}/${id}/receive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao receber inventário');
    return response.json();
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
}
