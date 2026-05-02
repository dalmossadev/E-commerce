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
console.log('Constante IMAGE_BASE_URL definida, origem da constante: /src/constants/site-config.ts');
export const IMAGE_BASE_URL = '/img/catalogo' as const;
export const BANNER_BASE_URL = '/img/banners' as const;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001' as const;

// ── Informações do site ───────────────────────────────────────────
console.log('Constante IMAGE_BASE_URL definida, origem da constante: /src/constants/site-config.ts'); 
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

console.log('Constante SITE_INFO definida, origem da constante: /src/constants/site-config.ts');
// ── Tipos ──────────────────────────────────────────────────────────
export type ProductCategory =
  | 'destaque'
  | 'eletronicos'
  | 'moda'
  | 'casa'
  | 'esporte'
  | 'beleza';

  console.log('Tipo ProductCategory definido, origem do tipo: /src/constants/site-config.ts');  
export type ProductBadge =
  | 'novo'
  | 'oferta'
  | 'exclusivo'
  | 'esgotando'
  | 'lancamento'
  | null;

  console.log('Tipos ProductCategory e ProductBadge definidos, origem dos tipos: /src/constants/site-config.ts');
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

console.log('Tipo Product definido, origem do tipo: /src/constants/site-config.ts');
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

// ── Produtos ───────────────────────────────────────────────────────
// Edite aqui para gerenciar o catálogo inteiro.
console.log('Constante PRODUCTS definida, origem da constante: /src/constants/site-config.ts');
export const PRODUCTS: Product[] = [
  {
    sku:         'PROD001',
    name:        'Tênis Runner Pro X',
    description: 'Amortecimento de alta performance para corridas urbanas. Solado em borracha de alta aderência.',
    price:       19990,
    originalPrice: 27990,
    imageName:   'tenis-runner-pro.webp',
    altText:     'Tênis Runner Pro X preto com detalhes em verde neon, vista lateral esquerda',
    category:    'esporte',
    badge:       'oferta',
    inStock:     true,
    featured:    true,
    whatsappMessage: 'Olá! Tenho interesse no *Tênis Runner Pro X* (SKU: PROD001). Pode me passar mais informações?',
    specs: {
      'Material':  'Mesh respirável + borracha',
      'Peso':      '285g (tam. 42)',
      'Drop':      '8mm',
      'Indicado':  'Corrida urbana, academia',
    },
  },
  
  {
    sku:         'PROD002',
    name:        'Mochila Urban Carry 30L',
    description: 'Mochila impermeável para o dia a dia urbano. Compartimento acolchoado para notebook até 16".',
    price:       14990,
    imageName:   'produto-9.webp',
    altText:     'Mochila Urban Carry preta com alças ergonômicas e zíper verde, vista frontal',
    category:    'moda',
    badge:       'novo',
    inStock:     true,
    featured:    true,
    specs: {
      'Volume':    '30 litros',
      'Material':  'Nylon 900D impermeável',
      'Notebook':  'Até 16 polegadas',
      'Garantia':  '1 ano',
    },
  },
  {
    sku:         'PROD003',
    name:        'Fone Auricular NoiseBlock',
    description: 'Cancelamento de ruído ativo. 40h de bateria. Qualidade de estúdio no dia a dia.',
    price:       34990,
    originalPrice: 49990,
    imageName:   'produto-3.webp',
    altText:     'Fone de ouvido over-ear NoiseBlock preto com almofadas de espuma e LED verde',
    category:    'eletronicos',
    badge:       'exclusivo',
    inStock:     true,
    featured:    true,
    whatsappMessage: 'Olá! Tenho interesse no *Fone NoiseBlock* (SKU: PROD003). Tem disponível?',
    specs: {
      'Bateria':   '40 horas (ANC ativo)',
      'Driver':    '40mm',
      'Codec':     'AAC, SBC, aptX',
      'Conexão':   'Bluetooth 5.3 + P2',
    },
  },
  {
    sku:         'PROD004',
    name:        'Smartwatch GT-9 Ultra',
    description: 'Monitor cardíaco, GPS integrado, 7 dias de bateria. Resistente à água IP68.',
    price:       28990,
    originalPrice: 39990,
    imageName:   'produto-4.webp',
    altText:     'Smartwatch GT-9 Ultra com pulseira preta e mostrador digital verde neon',
    category:    'eletronicos',
    badge:       'oferta',
    inStock:     true,
    featured:    false,
    specs: {
      'Tela':      'AMOLED 1.43"',
      'Bateria':   '7 dias',
      'GPS':       'Integrado',
      'Resistência':'IP68 (50m)',
    },
  },
  {
    sku:         'PROD005',
    name:        'Camiseta Dry-Fit Performance',
    description: 'Tecido com tecnologia anti-odor e secagem ultra-rápida. Ideal para treinos intensos.',
    price:       7990,
    imageName:   'produto-5.webp',
    altText:     'Camiseta dry-fit preta com faixas refletivas verdes e logo no peito',
    category:    'esporte',
    badge:       null,
    inStock:     true,
    featured:    false,
    specs: {
      'Material':  '92% Poliéster, 8% Elastano',
      'Tecnologia':'Anti-odor + UV50+',
      'Fit':       'Slim fit',
    },
  },
  {
    sku:         'PROD006',
    name:        'Garrafa Térmica StayHot 1L',
    description: 'Mantém quente por 24h e frio por 48h. Aço inox 18/8 dupla parede.',
    price:       8990,
    imageName:   'produto-6.webp',
    altText:     'Garrafa térmica preta 1 litro com tampa rosqueada e detalhe verde neon',
    category:    'esporte',
    badge:       null,
    inStock:     false,   // Fora de estoque — demonstra graceful degradation
    featured:    false,
    specs: {
      'Capacidade':'1000ml',
      'Quente':    '24 horas',
      'Frio':      '48 horas',
      'Material':  'Aço inox 18/8',
    },
  },
  {
    sku:         'PROD007',
    name:        'Tênis Casual Lowstep',
    description: 'Design minimalista com solado EVA ultra-leve. Para o dia a dia com estilo.',
    price:       15990,
    imageName:   'tenis-lowstep.webp',
    altText:     'Tênis casual Lowstep preto liso com solado branco e tag verde',
    category:    'moda',
    badge:       'esgotando',
    inStock:     true,
    featured:    true,
  },
  {
    sku:         'PROD008',
    name:        'Kit Skincare Noturno',
    description: 'Sérum + Hidratante + Máscara. Fórmula vegana com Vitamina C e Retinol.',
    price:       11990,
    originalPrice: 17990,
    imageName:   'produto-8.webp',
    altText:     'Kit skincare noturno com três produtos em embalagens pretas com letras verdes',
    category:    'beleza',
    badge:       'novo',
    inStock:     true,
    featured:    false,
  },
];

// ── Banners ────────────────────────────────────────────────────────
console.log('Constante BANNERS definida, origem da constante: /src/constants/site-config.ts');
export const BANNERS: Banner[] = [
  {
    id:           'banner-principal',
    title:        'PERFORMANCE\nSEM LIMITES',
    subtitle:     'Os melhores produtos de esporte e tech. Direto pra você via WhatsApp.',
    cta:          'Ver Catálogo',
    ctaHref:      '#catalogo',
    desktopImage: 'produto-10.webp',
    mobileImage:  'produto-11.webp',
    altText:      'Banner principal com produtos de performance em fundo preto e luz neon verde',
    priority:     true,
  },
  {
    id:           'banner-oferta',
    title:        'SUPER OFERTA\nDA SEMANA',
    subtitle:     'Até 40% de desconto nos melhores eletrônicos. Por tempo limitado.',
    cta:          'Aproveitar',
    ctaHref:      '#catalogo',
    desktopImage: 'produto-12.webp',
    mobileImage:  'produto-13.webp',
    altText:      'Banner de oferta da semana com eletrônicos em destaque',
    priority:     false,
  },
];

// ── Categorias (para filtro na vitrine) ───────────────────────────
console.log('Constante CATEGORIES definida, origem da constante: /src/constants/site-config.ts');
export const CATEGORIES: Array<{ value: ProductCategory | 'todos'; label: string; icon: string }> = [
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
  console.log('Função getProductBySku chamada, origem da função: /src/constants/site-config.ts:', sku);
  return PRODUCTS.find(p => p.sku === sku);
}

/** Formata centavos para BRL. Ex: 19990 → "R$ 199,90" */
export function formatPrice(cents: number): string {
  console.log('Função formatPrice chamada, origem da função: /src/constants/site-config.ts:', cents);
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

/** Calcula % de desconto entre preço original e atual */
export function calcDiscount(original: number, current: number): number {
  console.log('Função calcDiscount chamada, origem da função: /src/constants/site-config.ts:');
  return Math.round((1 - current / original) * 100);
}

/** Gera URL completa da imagem de produto */
export function getProductImageUrl(imageName: string): string {
  console.log('Função getProductImageUrl chamada, origem da função: /src/constants/site-config.ts:', imageName);
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
