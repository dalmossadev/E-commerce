// src/core/domain/Category.ts
export type CategoryType = 'PRODUCT' | 'SUPPLIER';

export class Category {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string | null;
  public type!: CategoryType;
  public parentId?: number | null;
  public parent?: Category | null;
  public children?: Category[];
  public createdAt!: Date;
  public updatedAt!: Date;

  constructor(props: Partial<Category> = {}) {
    Object.assign(this, props);
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public get isSubcategory(): boolean {
    return !!this.parentId;
  }
}
