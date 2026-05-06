export interface CreateSupplierDTO {
  companyName: string;
  tradeName?: string;
  cnpj: string;
  contactEmail: string;
  phone?: string;
  website?: string;
  categoryId: number;
  address?: Record<string, any>;
}

export interface UpdateSupplierDTO {
  companyName?: string;
  tradeName?: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  categoryId?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  address?: Record<string, any>;
}

export interface SupplierQueryDTO {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}