import { CategoryType } from "../domain/Category";

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  type: CategoryType;
  parentId?: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: number;
}

export interface CategoryQueryDTO {
  type?: CategoryType;
  parentId?: number;
  search?: string;
}

export interface CategoryResponseDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: CategoryType;
  parentId?: number;
  createdAt: Date;
  updatedAt: Date;
}
