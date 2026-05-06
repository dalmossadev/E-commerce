export interface ShippingRuleProps {
  id?: number;
  name: string;
  zipStart: string;
  zipEnd: string;
  price: number;
  minAmountForFreeShipping?: number;
  estimatedDays: number;
  active: boolean;
}

export class ShippingRule {
  public id?: number;
  public name!: string;
  public zipStart!: string;
  public zipEnd!: string;
  public price!: number;
  public minAmountForFreeShipping?: number;
  public estimatedDays!: number;
  public active!: boolean;

  constructor(props: Partial<ShippingRuleProps> = {}) {
    Object.assign(this, props);
    this.active = props.active ?? true;
  }

  public matches(zipCode: string): boolean {
    if (!this.active) return false;
    const cleanZip = zipCode.replace(/\D/g, '');
    const start = this.zipStart.replace(/\D/g, '');
    const end = this.zipEnd.replace(/\D/g, '');
    return cleanZip >= start && cleanZip <= end;
  }

  public calculatePrice(orderAmount: number): number {
    if (this.minAmountForFreeShipping && orderAmount >= this.minAmountForFreeShipping) {
      return 0;
    }
    return this.price;
  }
}
