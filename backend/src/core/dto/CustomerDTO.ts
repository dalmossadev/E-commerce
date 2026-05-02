import { Customer } from '@core/domain/Customer';

export interface CreateCustomerDTO {
  fullName: string;
  cpf: string;
  phone: string;
  address?: Record<string, any>;
}

export interface UpdateCustomerDTO {
  fullName?: string;
  cpf?: string;
  phone?: string;
  address?: Record<string, any>;
}

export interface CustomerQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'fullName' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CustomerResponseDTO {
  id: number;
  fullName: string;
  cpf: string;
  phone: string;
  address?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
