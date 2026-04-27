// ── Tipos ──────────────────────────────────────────────────────────
// ── Enums ──────────────────────────────────────────────────────
export enum LeadStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BOLETO = 'boleto',
}

export enum PurchaseStatus {
  PENDING = 'pending',
  ORDERED = 'ordered',
  SHIPPED = 'shipped',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

export type ProductCategory =
  | 'destaque'
  | 'eletronicos'
  | 'moda'
  | 'casa'
  | 'esporte'
  | 'beleza';

export type ProductBadge =
  | 'novo'
  | 'oferta'
  | 'exclusivo'
  | 'esgotando'
  | null;

export interface Product {
  sku:         string;        // Identificador único. Ex: 'PROD001'
  name:        string;
  description: string;
  price:       number;        // Em centavos. Ex: 19990 = R$199,90
  originalPrice?: number;     // Preço original (para exibir desconto)
  imageName:   string;        // Apenas o arquivo. Ex: 'tenis-preto.webp'
  altText:     string;        // Acessibilidade — descreva a imagem
  category:    ProductCategory;
  badge:       ProductBadge;
  inStock:     boolean;
  whatsappMessage?: string;   // Mensagem personalizada por produto
  featured:    boolean;       // Aparece na seção de destaques
  specs?: Record<string, string>; // Especificações técnicas opcionais
}

export interface Banner {
  id:           string;
  title:        string;
  subtitle:     string;
  cta:          string;
  ctaHref:      string;
  desktopImage: string;       // Ex: 'banner-desktop.webp'
  mobileImage:  string;       // Ex: 'banner-mobile.webp'
  altText:      string;
  priority:     boolean;      // true para o banner principal (LCP)
}



