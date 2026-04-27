export enum LeadStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}

export class Lead {
  id!: number;
  sku!: string;
  customerName!: string;
  customerPhone!: string;
  customerEmail?: string;
  status!: LeadStatus;
  notes?: string;
  productId?: number;
  variantId?: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: Partial<Lead> = {}) {
    Object.assign(this, props);
    this.status = this.status || LeadStatus.PENDING;
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }

  confirm(): void {
    if (this.status !== LeadStatus.PENDING) {
      throw new Error('Only pending leads can be confirmed');
    }
    this.status = LeadStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  reject(): void {
    if (this.status !== LeadStatus.PENDING) {
      throw new Error('Only pending leads can be rejected');
    }
    this.status = LeadStatus.REJECTED;
    this.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.status === LeadStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.status === LeadStatus.CONFIRMED;
  }

  isRejected(): boolean {
    return this.status === LeadStatus.REJECTED;
  }

  updateNotes(notes: string): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }
}