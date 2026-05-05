export interface IPaymentProps {
  orderId: number;
  amount: number;
  pixKey: string;
  merchantName: string;
  city: string;
  description?: string;
}