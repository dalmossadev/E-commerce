import { Product } from "./Product";

export enum FulfillmentType {
  ON_DEMAND = 'ON_DEMAND',
  IN_STOCK = 'IN_STOCK'
}

export class ProductVariant {
    public id?: number;
    public sku!: string;
    public productId!: number;
    public color!: string;
    public size!: string;
    public price!: number;
    private _stock!: number;
    public inStock!: boolean;
    public fulfillmentType!: FulfillmentType;
    public product?: Product;

    constructor(props: Partial<ProductVariant> = {}) {
        Object.assign(this, props);
        this._stock = props.stock ?? 0;
        
        if (!this.fulfillmentType) {
          this.fulfillmentType = FulfillmentType.ON_DEMAND;
        }
        
        this.updateInStockStatus();
    }

    get stock(): number {
        return this._stock;
    }

    set stock(value: number) {
        if (value < 0 && this.fulfillmentType === FulfillmentType.IN_STOCK) {
            throw new Error('Stock cannot be negative for IN_STOCK fulfillment type');
        }
        this._stock = value;
        this.updateInStockStatus();
    }

    private updateInStockStatus(): void {
        if (this.fulfillmentType === FulfillmentType.ON_DEMAND) {
            this.inStock = true;
        } else {
            this.inStock = this._stock > 0;
        }
    }

    isOnDemand(): boolean {
      return this.fulfillmentType === FulfillmentType.ON_DEMAND;
    }

    isInStock(): boolean {
      return this.fulfillmentType === FulfillmentType.IN_STOCK;
    }

    requiresStock(): boolean {
      return this.fulfillmentType === FulfillmentType.IN_STOCK;
    }

    decreaseStock(amount: number): void {
        if (this.isOnDemand()) {
            return;
        }
        
        if (this._stock - amount < 0) {
            throw new Error('Insufficient stock');
        }
        
        this._stock -= amount;
        this.updateInStockStatus();
    }

    increaseStock(amount: number): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        
        this._stock += amount;
        this.updateInStockStatus();
    }
}