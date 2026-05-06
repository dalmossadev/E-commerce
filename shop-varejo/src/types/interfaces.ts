// ── Tipos ──────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
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

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: 'PRODUCT' | 'SUPPLIER';
}

export type ProductCategory =
  | 'destaque'
  | 'eletronicos'
  | 'moda'
  | 'casa'
  | 'esporte'
  | 'beleza'
  | string; // Permitir categorias dinâmicas do backend

export type ProductBadge =
  | 'novo'
  | 'oferta'
  | 'exclusivo'
  | 'esgotando'
  | null;

export interface Product {
  id:          number;        // ID do banco de dados
  sku:         string;        // Identificador único. Ex: 'PROD001'
  name:        string;
  description: string;
  basePrice:   number;        // Em centavos. Ex: 19990 = R$199,90
  originalPrice?: number;     // Preço original (para exibir desconto)
  imageName:   string;        // Apenas o arquivo. Ex: 'tenis-preto.webp'
  altText:     string;        // Acessibilidade — descreva a imagem
  categoryId:  number;        // ID da categoria no banco
  category?:   Category;      // Objeto completo da categoria
  badge:       ProductBadge;
  inStock:     boolean;
  whatsappMessage?: string;   // Mensagem personalizada por produto
  featured:    boolean;       // Aparece na seção de destaques
  specs?: Record<string, any>; // Especificações técnicas opcionais
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




export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isMain: boolean;
  tag?: string;
  customerId?: number;
  supplierId?: number;
}

export interface Customer {
  id: number;
  fullName: string;
  cpf: string;
  phone: string;
  addresses?: Address[];
}
