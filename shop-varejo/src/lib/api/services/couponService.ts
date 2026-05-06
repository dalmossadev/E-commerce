import { API_BASE_URL } from '@/constants/site-config';

export interface Coupon {
  id?: number;
  code: string;
  type: 'FIXED' | 'PERCENTAGE';
  value: number;
  minOrderAmount?: number;
  expirationDate?: string | Date;
  maxUses?: number;
  currentUses?: number;
  active: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  discountAmount: number;
  type: string;
  value: number;
  message?: string;
}

export const couponService = {
  async validate(code: string, amount: number): Promise<CouponValidationResult> {
    const response = await fetch(`${API_BASE_URL}/api/v1/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount }),
    });
    if (!response.ok) throw new Error('Erro ao validar cupom');
    return response.json();
  },

  async list(): Promise<Coupon[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/coupons`);
    if (!response.ok) throw new Error('Falha ao buscar cupons');
    return response.json();
  },

  async save(coupon: Partial<Coupon>): Promise<Coupon> {
    const response = await fetch(`${API_BASE_URL}/api/v1/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    });
    if (!response.ok) throw new Error('Erro ao salvar cupom');
    return response.json();
  }
};
