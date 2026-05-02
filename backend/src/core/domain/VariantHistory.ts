export class VariantHistory {
  id!: string;
  sku!: string;
  action!: string;
  oldPrice?: number;
  newPrice?: number;
  oldStock?: number;
  newStock?: number;
  changedBy?: string;
  createdAt!: Date;

  constructor(props: Partial<VariantHistory> = {}) {
    Object.assign(this, props);
    this.createdAt = this.createdAt || new Date();
  }
}
