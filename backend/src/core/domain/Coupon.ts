export enum DiscountType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
}

export interface CouponProps {
  id?: number;
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  expirationDate?: Date;
  maxUses?: number;
  currentUses: number;
  active: boolean;
}

export class Coupon {
  public id?: number;
  public code!: string;
  public type!: DiscountType;
  public value!: number;
  public minOrderAmount?: number;
  public expirationDate?: Date;
  public maxUses?: number;
  public currentUses!: number;
  public active!: boolean;

  constructor(props: Partial<CouponProps> = {}) {
    Object.assign(this, props);
    this.code = props.code?.toUpperCase() || '';
    this.currentUses = props.currentUses ?? 0;
    this.active = props.active ?? true;
  }

  public isValid(orderAmount: number): boolean {
    if (!this.active) return false;
    if (this.expirationDate && new Date() > this.expirationDate) return false;
    if (this.maxUses && this.currentUses >= this.maxUses) return false;
    if (this.minOrderAmount && orderAmount < this.minOrderAmount) return false;
    return true;
  }

  public calculateDiscount(orderAmount: number): number {
    if (!this.isValid(orderAmount)) return 0;
    
    if (this.type === DiscountType.PERCENTAGE) {
      return Math.floor(orderAmount * (this.value / 100));
    }
    return Math.min(this.value, orderAmount);
  }
}
