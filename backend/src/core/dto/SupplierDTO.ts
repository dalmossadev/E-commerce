export interface CreateSupplierDTO {
  companyName: string;
  cnpj: string;
  contactEmail: string;
  category: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierDTO {
  companyName?: string;
  contactEmail?: string;
  category?: string;
  phone?: string;
  address?: string;
}

export interface SupplierQueryDTO {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}