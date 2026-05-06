/**
 * @file src/constants/site-config.ts
 * @description O CÉREBRO DO PROJETO.
 *
 * Toda a inteligência do site vive aqui.
 * Para atualizar produto, banner ou texto — edite APENAS este arquivo.
 * Não é necessário tocar em nenhum componente.
 *
 * ─── COMO ADICIONAR UM PRODUTO ───────────────────────────────────
 * 1. Coloque a imagem em /public/img/catalogo/nome-do-arquivo.webp
 * 2. Adicione um objeto no array PRODUCTS com o novo SKU
 * 3. Na page.tsx, passe o SKU no componente <ProductCard sku="PROD_NOVO" />
 * ─────────────────────────────────────────────────────────────────
 */

// ── Base de imagens — altere apenas aqui para migrar de servidor ──
export const IMAGE_BASE_URL = '/img/catalogo' as const;
export const BANNER_BASE_URL = '/img/banners' as const;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001' as const;

// ── Informações do site ───────────────────────────────────────────
export const SITE_INFO = {
  name:        'SHOP VAREJO',
  tagline:     'Produtos selecionados. Qualidade garantida.',
  description: 'E-commerce premium com estoque selecionado e entrega via WhatsApp.',
  whatsapp: {
    number:  '557187833065',
    message: 'Olá! Vi o site e tenho interesse em um produto.',
  },
  social: {
    instagram: 'https://instagram.com/shopvarejo',
  },
} as const;

// ── Tipos ──────────────────────────────────────────────────────────
export type ProductCategory =
  | 'destaque'
  | 'eletronicos'
  | 'moda'
  | 'casa'
  | 'esporte'
  | 'beleza'
  | string;

export type ProductBadge =
  | 'novo'
  | 'oferta'
  | 'exclusivo'
  | 'esgotando'
  | 'lancamento'
  | null;

// ── Produtos (Legado/Fallback) ─────────────────────────────────────
// Nota: Os produtos agora são carregados dinamicamente via API.
export const PRODUCTS: any[] = [];

// ── Banners (Legado/Fallback) ──────────────────────────────────────
export const BANNERS: any[] = [];

// ── Categorias (para filtro na vitrine) ───────────────────────────
// Nota: O componente CategoryFilter agora busca estas categorias via API.
export const CATEGORIES_FALLBACK = [
  { value: 'todos',      label: 'Todos',       icon: '⊞' },
  { value: 'esporte',    label: 'Esporte',     icon: '⚡' },
  { value: 'eletronicos',label: 'Eletrônicos', icon: '◈' },
  { value: 'moda',       label: 'Moda',        icon: '◇' },
  { value: 'beleza',     label: 'Beleza',      icon: '◎' },
  { value: 'casa',       label: 'Casa',        icon: '⬡' },
];

// ── Helpers ────────────────────────────────────────────────────────

/** Busca produto pelo SKU. Retorna undefined se não existir. */
export function getProductBySku(sku: string): Product | undefined {
  return PRODUCTS.find(p => p.sku === sku);
}

/** Formata centavos para BRL. Ex: 19990 → "R$ 199,90" */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

/** Calcula % de desconto entre preço original e atual */
export function calcDiscount(original: number, current: number): number {
  return Math.round((1 - current / original) * 100);
}

/** Gera URL completa da imagem de produto */
export function getProductImageUrl(imageName: string): string {
  return `${IMAGE_BASE_URL}/${imageName}`;
}

/** Gera link WhatsApp com mensagem codificada */
export function getWhatsAppLink(message?: string, settings?: { number: string; message: string }): string {
  const whatsappNumber = settings?.number || SITE_INFO.whatsapp.number;
  const defaultMessage = settings?.message || SITE_INFO.whatsapp.message;
  
  const msg = encodeURIComponent(
    message ?? defaultMessage
  );
  return `https://wa.me/${whatsappNumber}?text=${msg}`;
}
