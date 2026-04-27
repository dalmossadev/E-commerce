export enum PurchaseStatus {
  PENDING = 'PENDING',
  ORDERED = 'ORDERED',
  SHIPPED = 'SHIPPED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export class PurchaseItem {
  id!: number;
  purchaseId!: number;
  variantId!: number;
  sku!: string;
  productName!: string;
  color?: string;
  size?: string;
  quantity!: number;
  unitCost!: number;
  totalCost!: number;

  constructor(props: Partial<PurchaseItem> = {}) {
    Object.assign(this, props);
    if (props.quantity && props.unitCost) {
      this.totalCost = props.quantity * props.unitCost;
    }
  }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.quantity = quantity;
    this.totalCost = this.quantity * this.unitCost;
  }
}

export class Purchase {
  id!: number;
  supplierId!: number;
  supplierName!: string;
  items!: PurchaseItem[];
  subtotal!: number;
  total!: number;
  status!: PurchaseStatus;
  notes?: string;
  expectedDeliveryDate?: Date;
  trackingNumber?: string;
  createdAt!: Date;
  updatedAt!: Date;

  private static readonly VALID_TRANSITIONS: Record<PurchaseStatus, PurchaseStatus[]> = {
    [PurchaseStatus.PENDING]: [PurchaseStatus.ORDERED, PurchaseStatus.CANCELLED],
    [PurchaseStatus.ORDERED]: [PurchaseStatus.SHIPPED, PurchaseStatus.CANCELLED],
    [PurchaseStatus.SHIPPED]: [PurchaseStatus.RECEIVED],
    [PurchaseStatus.RECEIVED]: [],
    [PurchaseStatus.CANCELLED]: []
  };

  constructor(props: Partial<Purchase> = {}) {
    Object.assign(this, props);
    this.status = this.status || PurchaseStatus.PENDING;
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.subtotal = this.items?.reduce((sum, item) => sum + item.totalCost, 0) || 0;
    this.total = this.subtotal;
  }

  canTransitionTo(newStatus: PurchaseStatus): boolean {
    const allowedTransitions = Purchase.VALID_TRANSITIONS[this.status] || [];
    return allowedTransitions.includes(newStatus);
  }

  transitionTo(newStatus: PurchaseStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  receiveInventory(): void {
    if (!this.canTransitionTo(PurchaseStatus.RECEIVED)) {
      throw new Error(`Cannot receive inventory in ${this.status} status`);
    }
    this.status = PurchaseStatus.RECEIVED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (!this.canTransitionTo(PurchaseStatus.CANCELLED)) {
      throw new Error('Cannot cancel purchase in current status');
    }
    this.status = PurchaseStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  markAsOrdered(): void {
    if (!this.canTransitionTo(PurchaseStatus.ORDERED)) {
      throw new Error('Cannot mark purchase as ordered in current status');
    }
    this.status = PurchaseStatus.ORDERED;
    this.updatedAt = new Date();
  }

  markAsShipped(trackingNumber?: string): void {
    if (!this.canTransitionTo(PurchaseStatus.SHIPPED)) {
      throw new Error('Cannot mark purchase as shipped in current status');
    }
    this.trackingNumber = trackingNumber;
    this.status = PurchaseStatus.SHIPPED;
    this.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.status === PurchaseStatus.PENDING;
  }

  isOrdered(): boolean {
    return this.status === PurchaseStatus.ORDERED;
  }

  isShipped(): boolean {
    return this.status === PurchaseStatus.SHIPPED;
  }

  isReceived(): boolean {
    return this.status === PurchaseStatus.RECEIVED;
  }

  isCancelled(): boolean {
    return this.status === PurchaseStatus.CANCELLED;
  }
}