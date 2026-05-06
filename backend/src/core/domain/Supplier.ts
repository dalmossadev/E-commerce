// src/core/domain/Supplier.ts
import { Address } from './Address';
import { Category } from './Category';
export class Supplier {
  id!: number;
  companyName!: string;
  tradeName?: string;
  cnpj!: string;
  contactEmail!: string;
  phone?: string;
  website?: string;
  categoryId!: number;
  category?: Category;
  status!: 'ACTIVE' | 'INACTIVE';
  addresses!: Address[];
  createdAt!: Date;
  updatedAt!: Date;
}