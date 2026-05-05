import { IPaymentProvider, ChargeResponse, PaymentStatus } from '@core/interfaces/IPaymentProvider';
import axios from 'axios';
import crypto from 'crypto';

interface AccessToken {
  token: string;
  expiresAt: number;
}

export class InfinitePayService implements IPaymentProvider {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private webhookSecret: string;
  private tokenCache: AccessToken | null = null;

  constructor() {
    this.clientId = process.env.INFINITEPAY_CLIENT_ID || '';
    this.clientSecret = process.env.INFINITEPAY_CLIENT_SECRET || '';
    this.baseUrl = process.env.INFINITEPAY_BASE_URL || 'https://api.infinitepay.io';
    this.webhookSecret = process.env.INFINITEPAY_WEBHOOK_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { access_token, expires_in } = response.data;
      
      this.tokenCache = {
        token: access_token,
        expiresAt: Date.now() + (expires_in - 60) * 1000 // Buffer of 60 seconds
      };

      return access_token;
    } catch (error) {
      console.error('Failed to get InfinitePay access token:', error);
      throw new Error('Failed to authenticate with payment provider');
    }
  }

  async generateCharge(orderId: string, amountCents: number, description: string): Promise<ChargeResponse> {
    const token = await this.getAccessToken();
    const amountInReais = (amountCents / 100).toFixed(2);
    
    // As per InfinitePay docs, expires in seconds
    const expiresIn = 1800; // 30 minutes

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/charges`,
        {
          amount: parseFloat(amountInReais),
          metadata: { orderId, description },
          payment_method: 'pix',
          expires_in: expiresIn
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const qrCodePayload = response.data.payment_method?.pix?.br_code || response.data.br_code;
      const qrCodeBase64 = response.data.payment_method?.pix?.qr_code_url || '';
      const externalId = response.data.id;

      return {
        externalId,
        qrCodePayload,
        qrCodeBase64,
        expiresAt: new Date(Date.now() + expiresIn * 1000)
      };
    } catch (error) {
      console.error('Failed to generate InfinitePay charge:', error);
      throw new Error('Failed to create charge with payment provider');
    }
  }

  async getChargeStatus(externalId: string): Promise<PaymentStatus> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get(`${this.baseUrl}/v1/charges/${externalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const status = response.data.status;
      if (status === 'approved' || status === 'paid') return 'PAID';
      if (status === 'declined' || status === 'failed') return 'FAILED';
      if (status === 'expired') return 'EXPIRED';
      return 'PENDING';
    } catch (error) {
      console.error(`Failed to get charge status for ${externalId}:`, error);
      return 'FAILED'; // Fallback
    }
  }

  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch (e) {
      return signature === expectedSignature;
    }
  }
}
