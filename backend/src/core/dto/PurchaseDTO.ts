import { PurchaseStatus } from '@core/domain/Purchase';

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
  expectedDeliveryDate?: Date;
}

export interface UpdatePurchaseDTO {
  status?: PurchaseStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface ReceiveInventoryDTO {
  items: {
    variantId: number;
    quantity: number;
  }[];
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
  items: {
    id: number;
    variantId: number;
    sku: string;
    productName: string;
    color?: string;
    size?: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
  subtotal: number;
  total: number;
  status: PurchaseStatus;
  notes?: string;
  expectedDeliveryDate?: Date;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}