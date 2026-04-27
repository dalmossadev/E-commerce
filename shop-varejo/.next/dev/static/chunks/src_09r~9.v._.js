(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/constants/site-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ // ── Base de imagens — altere apenas aqui para migrar de servidor ──
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "BANNERS",
    ()=>BANNERS,
    "BANNER_BASE_URL",
    ()=>BANNER_BASE_URL,
    "CATEGORIES",
    ()=>CATEGORIES,
    "IMAGE_BASE_URL",
    ()=>IMAGE_BASE_URL,
    "PRODUCTS",
    ()=>PRODUCTS,
    "SITE_INFO",
    ()=>SITE_INFO,
    "calcDiscount",
    ()=>calcDiscount,
    "formatPrice",
    ()=>formatPrice,
    "getProductBySku",
    ()=>getProductBySku,
    "getProductImageUrl",
    ()=>getProductImageUrl,
    "getWhatsAppLink",
    ()=>getWhatsAppLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const IMAGE_BASE_URL = '/img/catalogo';
const BANNER_BASE_URL = '/img/banners';
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001") || 'http://localhost:3001';
const SITE_INFO = {
    name: 'SHOP VAREJO',
    tagline: 'Produtos selecionados. Qualidade garantida.',
    description: 'E-commerce premium com estoque selecionado e entrega via WhatsApp.',
    whatsapp: {
        number: '557187833065',
        message: 'Olá! Vi o site e tenho interesse em um produto.'
    },
    social: {
        instagram: 'https://instagram.com/shopvarejo'
    }
};
const PRODUCTS = [
    {
        sku: 'PROD001',
        name: 'Tênis Runner Pro X',
        description: 'Amortecimento de alta performance para corridas urbanas. Solado em borracha de alta aderência.',
        price: 19990,
        originalPrice: 27990,
        imageName: 'tenis-runner-pro.webp',
        altText: 'Tênis Runner Pro X preto com detalhes em verde neon, vista lateral esquerda',
        category: 'esporte',
        badge: 'oferta',
        inStock: true,
        featured: true,
        whatsappMessage: 'Olá! Tenho interesse no *Tênis Runner Pro X* (SKU: PROD001). Pode me passar mais informações?',
        specs: {
            'Material': 'Mesh respirável + borracha',
            'Peso': '285g (tam. 42)',
            'Drop': '8mm',
            'Indicado': 'Corrida urbana, academia'
        }
    },
    {
        sku: 'PROD002',
        name: 'Mochila Urban Carry 30L',
        description: 'Mochila impermeável para o dia a dia urbano. Compartimento acolchoado para notebook até 16".',
        price: 14990,
        imageName: 'produto-9.webp',
        altText: 'Mochila Urban Carry preta com alças ergonômicas e zíper verde, vista frontal',
        category: 'moda',
        badge: 'novo',
        inStock: true,
        featured: true,
        specs: {
            'Volume': '30 litros',
            'Material': 'Nylon 900D impermeável',
            'Notebook': 'Até 16 polegadas',
            'Garantia': '1 ano'
        }
    },
    {
        sku: 'PROD003',
        name: 'Fone Auricular NoiseBlock',
        description: 'Cancelamento de ruído ativo. 40h de bateria. Qualidade de estúdio no dia a dia.',
        price: 34990,
        originalPrice: 49990,
        imageName: 'produto-3.webp',
        altText: 'Fone de ouvido over-ear NoiseBlock preto com almofadas de espuma e LED verde',
        category: 'eletronicos',
        badge: 'exclusivo',
        inStock: true,
        featured: true,
        whatsappMessage: 'Olá! Tenho interesse no *Fone NoiseBlock* (SKU: PROD003). Tem disponível?',
        specs: {
            'Bateria': '40 horas (ANC ativo)',
            'Driver': '40mm',
            'Codec': 'AAC, SBC, aptX',
            'Conexão': 'Bluetooth 5.3 + P2'
        }
    },
    {
        sku: 'PROD004',
        name: 'Smartwatch GT-9 Ultra',
        description: 'Monitor cardíaco, GPS integrado, 7 dias de bateria. Resistente à água IP68.',
        price: 28990,
        originalPrice: 39990,
        imageName: 'produto-4.webp',
        altText: 'Smartwatch GT-9 Ultra com pulseira preta e mostrador digital verde neon',
        category: 'eletronicos',
        badge: 'oferta',
        inStock: true,
        featured: false,
        specs: {
            'Tela': 'AMOLED 1.43"',
            'Bateria': '7 dias',
            'GPS': 'Integrado',
            'Resistência': 'IP68 (50m)'
        }
    },
    {
        sku: 'PROD005',
        name: 'Camiseta Dry-Fit Performance',
        description: 'Tecido com tecnologia anti-odor e secagem ultra-rápida. Ideal para treinos intensos.',
        price: 7990,
        imageName: 'produto-5.webp',
        altText: 'Camiseta dry-fit preta com faixas refletivas verdes e logo no peito',
        category: 'esporte',
        badge: null,
        inStock: true,
        featured: false,
        specs: {
            'Material': '92% Poliéster, 8% Elastano',
            'Tecnologia': 'Anti-odor + UV50+',
            'Fit': 'Slim fit'
        }
    },
    {
        sku: 'PROD006',
        name: 'Garrafa Térmica StayHot 1L',
        description: 'Mantém quente por 24h e frio por 48h. Aço inox 18/8 dupla parede.',
        price: 8990,
        imageName: 'produto-6.webp',
        altText: 'Garrafa térmica preta 1 litro com tampa rosqueada e detalhe verde neon',
        category: 'esporte',
        badge: null,
        inStock: false,
        featured: false,
        specs: {
            'Capacidade': '1000ml',
            'Quente': '24 horas',
            'Frio': '48 horas',
            'Material': 'Aço inox 18/8'
        }
    },
    {
        sku: 'PROD007',
        name: 'Tênis Casual Lowstep',
        description: 'Design minimalista com solado EVA ultra-leve. Para o dia a dia com estilo.',
        price: 15990,
        imageName: 'tenis-lowstep.webp',
        altText: 'Tênis casual Lowstep preto liso com solado branco e tag verde',
        category: 'moda',
        badge: 'esgotando',
        inStock: true,
        featured: true
    },
    {
        sku: 'PROD008',
        name: 'Kit Skincare Noturno',
        description: 'Sérum + Hidratante + Máscara. Fórmula vegana com Vitamina C e Retinol.',
        price: 11990,
        originalPrice: 17990,
        imageName: 'produto-8.webp',
        altText: 'Kit skincare noturno com três produtos em embalagens pretas com letras verdes',
        category: 'beleza',
        badge: 'novo',
        inStock: true,
        featured: false
    }
];
const BANNERS = [
    {
        id: 'banner-principal',
        title: 'PERFORMANCE\nSEM LIMITES',
        subtitle: 'Os melhores produtos de esporte e tech. Direto pra você via WhatsApp.',
        cta: 'Ver Catálogo',
        ctaHref: '#catalogo',
        desktopImage: 'produto-10.webp',
        mobileImage: 'produto-11.webp',
        altText: 'Banner principal com produtos de performance em fundo preto e luz neon verde',
        priority: true
    },
    {
        id: 'banner-oferta',
        title: 'SUPER OFERTA\nDA SEMANA',
        subtitle: 'Até 40% de desconto nos melhores eletrônicos. Por tempo limitado.',
        cta: 'Aproveitar',
        ctaHref: '#catalogo',
        desktopImage: 'produto-12.webp',
        mobileImage: 'produto-13.webp',
        altText: 'Banner de oferta da semana com eletrônicos em destaque',
        priority: false
    }
];
const CATEGORIES = [
    {
        value: 'todos',
        label: 'Todos',
        icon: '⊞'
    },
    {
        value: 'esporte',
        label: 'Esporte',
        icon: '⚡'
    },
    {
        value: 'eletronicos',
        label: 'Eletrônicos',
        icon: '◈'
    },
    {
        value: 'moda',
        label: 'Moda',
        icon: '◇'
    },
    {
        value: 'beleza',
        label: 'Beleza',
        icon: '◎'
    },
    {
        value: 'casa',
        label: 'Casa',
        icon: '⬡'
    }
];
function getProductBySku(sku) {
    return PRODUCTS.find((p)=>p.sku === sku);
}
function formatPrice(cents) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(cents / 100);
}
function calcDiscount(original, current) {
    return Math.round((1 - current / original) * 100);
}
function getProductImageUrl(imageName) {
    return `${IMAGE_BASE_URL}/${imageName}`;
}
function getWhatsAppLink(message) {
    const msg = encodeURIComponent(message ?? SITE_INFO.whatsapp.message);
    return `https://wa.me/${SITE_INFO.whatsapp.number}?text=${msg}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @file src/lib/utils.ts
 * @description Utilitários globais.
 */ /** Combina classes Tailwind de forma segura (substitui clsx + twMerge) */ __turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatBRL",
    ()=>formatBRL
]);
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
function formatBRL(cents) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(cents / 100);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @file src/components/ui/Button.tsx
 * @description Componente de botão polimórfico com variantes.
 *
 * Princípio SOLID aplicado:
 *   - SRP: só renderiza botão
 *   - OCP: novas variantes via prop, sem alterar código existente
 *   - LSP: 'as' prop permite usar como <a>, <button>, etc.
 *
 * @example
 *   <Button variant="primary" size="lg" onClick={fn}>Comprar</Button>
 *   <Button variant="outline" as="a" href="https://wa.me/...">WhatsApp</Button>
 */ __turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
// ── Estilos por variante ───────────────────────────────────────────
const VARIANT_STYLES = {
    primary: 'bg-brand-primary text-brand-background border-2 border-brand-primary ' + 'hover:bg-transparent hover:text-brand-primary ' + 'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ' + 'shadow-neon-sm hover:shadow-neon active:scale-95',
    outline: 'bg-transparent text-brand-primary border-2 border-brand-primary ' + 'hover:bg-brand-primary hover:text-brand-background ' + 'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ' + 'hover:shadow-neon active:scale-95',
    ghost: 'bg-transparent text-brand-text border-2 border-brand-border ' + 'hover:border-brand-primary hover:text-brand-primary ' + 'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black',
    danger: 'bg-red-600 text-white border-2 border-red-600 ' + 'hover:bg-transparent hover:text-red-400 hover:border-red-400 ' + 'focus-visible:ring-2 focus-visible:ring-red-500'
};
const SIZE_STYLES = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5'
};
function Button({ variant = 'primary', size = 'md', loading = false, fullWidth = false, leftIcon, rightIcon, children, className, as, ...rest }) {
    const baseClass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(// Base
    'inline-flex items-center justify-center', 'font-display font-bold tracking-wider uppercase', 'rounded-lg transition-all duration-200', 'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none', 'select-none', // Responsivo: full width no mobile
    fullWidth ? 'w-full' : 'w-full sm:w-auto', // Variante e tamanho
    VARIANT_STYLES[variant], SIZE_STYLES[size], className);
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "animate-spin",
                size: 16,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Button.tsx",
                lineNumber: 115,
                columnNumber: 11
            }, this) : leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                children: leftIcon
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Button.tsx",
                lineNumber: 116,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Button.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            !loading && rightIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                children: rightIcon
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Button.tsx",
                lineNumber: 119,
                columnNumber: 33
            }, this)
        ]
    }, void 0, true);
    if (as === 'a') {
        const { href, target, rel, ...anchorRest } = rest;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            target: target,
            rel: target === '_blank' ? `noreferrer noopener ${rel ?? ''}`.trim() : rel,
            className: baseClass,
            ...anchorRest,
            children: content
        }, void 0, false, {
            fileName: "[project]/src/components/ui/Button.tsx",
            lineNumber: 126,
            columnNumber: 7
        }, this);
    }
    const { disabled, type = 'button', ...btnRest } = rest;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        disabled: disabled || loading,
        "aria-busy": loading,
        className: baseClass,
        ...btnRest,
        children: content
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Button.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/site-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/**
 * @file src/components/layout/Header.tsx
 */ 'use client';
;
;
;
;
;
function Header() {
    _s();
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const onScroll = {
                "Header.useEffect.onScroll": ()=>setScrolled(window.scrollY > 20)
            }["Header.useEffect.onScroll"];
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            return ({
                "Header.useEffect": ()=>window.removeEventListener('scroll', onScroll)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    const navLinks = [
        {
            href: '#catalogo',
            label: 'Catálogo'
        },
        {
            href: '#destaques',
            label: 'Destaques'
        },
        {
            href: '#sobre',
            label: 'Sobre'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-brand-border' : 'bg-transparent'}`,
        role: "banner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container-app",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2 group",
                            "aria-label": `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SITE_INFO"].name} — página inicial`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                    size: 20,
                                    className: "text-brand-primary group-hover:animate-neon-pulse",
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-display font-bold text-lg tracking-widest text-brand-text group-hover:text-neon transition-colors",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SITE_INFO"].name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            "aria-label": "Navegação principal",
                            className: "hidden md:flex items-center gap-8",
                            children: navLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: link.href,
                                    className: "font-mono text-sm text-brand-muted hover:text-brand-primary transition-colors tracking-wider uppercase",
                                    children: link.label
                                }, link.href, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                as: "a",
                                href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppLink"])(),
                                target: "_blank",
                                variant: "outline",
                                size: "sm",
                                "aria-label": "Entrar em contato via WhatsApp",
                                children: "WhatsApp"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "md:hidden text-brand-muted hover:text-brand-primary transition-colors p-2",
                            onClick: ()=>setMobileOpen((v)=>!v),
                            "aria-label": mobileOpen ? 'Fechar menu' : 'Abrir menu',
                            "aria-expanded": mobileOpen,
                            "aria-controls": "mobile-menu",
                            children: mobileOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 24,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 94,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                size: 24,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 95,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                id: "mobile-menu",
                className: "md:hidden bg-brand-surface border-t border-brand-border",
                "aria-label": "Menu mobile",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-app py-4 flex flex-col gap-4",
                    children: [
                        navLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: link.href,
                                onClick: ()=>setMobileOpen(false),
                                className: "font-mono text-sm text-brand-muted hover:text-brand-primary transition-colors tracking-wider uppercase py-2",
                                children: link.label
                            }, link.href, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 109,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            as: "a",
                            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppLink"])(),
                            target: "_blank",
                            variant: "primary",
                            size: "sm",
                            fullWidth: true,
                            children: "WhatsApp"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 107,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Header.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(Header, "moUcU2J4YHazgmQMN2Ea+ACEGYM=");
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/features/FloatingWhatsApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingWhatsApp",
    ()=>FloatingWhatsApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/site-config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/**
 * @file src/components/features/FloatingWhatsApp.tsx
 * @description Botão flutuante de WhatsApp.
 * Número e mensagem vindos do site-config.ts.
 */ 'use client';
;
;
;
function FloatingWhatsApp() {
    _s();
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Aparece após rolar 200px
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingWhatsApp.useEffect": ()=>{
            const onScroll = {
                "FloatingWhatsApp.useEffect.onScroll": ()=>setVisible(window.scrollY > 200)
            }["FloatingWhatsApp.useEffect.onScroll"];
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            onScroll();
            return ({
                "FloatingWhatsApp.useEffect": ()=>window.removeEventListener('scroll', onScroll)
            })["FloatingWhatsApp.useEffect"];
        }
    }["FloatingWhatsApp.useEffect"], []);
    const waLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppLink"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3
                  transition-all duration-500
                  ${visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}`,
        "aria-live": "polite",
        children: [
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-brand-surface border border-brand-primary/30 rounded-2xl p-4 max-w-[240px] shadow-neon-sm animate-fade-up",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setExpanded(false),
                        className: "absolute top-2 right-2 text-brand-muted hover:text-brand-text",
                        "aria-label": "Fechar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-display text-xs text-brand-primary tracking-wider uppercase mb-1",
                        children: "Fale conosco"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-brand-muted mb-3 leading-relaxed",
                        children: "Dúvidas sobre produtos? Resposta em menos de 10 min!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: waLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "flex items-center gap-2 bg-brand-primary text-brand-background text-xs font-bold px-3 py-2 rounded-lg hover:bg-brand-neon-dim transition-colors",
                        "aria-label": "Abrir WhatsApp",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                size: 14,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            "Abrir WhatsApp"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setExpanded((v)=>!v),
                className: "relative w-14 h-14 rounded-full bg-brand-primary text-brand-background flex items-center justify-center shadow-neon animate-neon-pulse hover:scale-110 active:scale-95 transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                "aria-label": expanded ? 'Fechar chat WhatsApp' : 'Abrir chat WhatsApp',
                "aria-expanded": expanded,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                        size: 26,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-blink",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/FloatingWhatsApp.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(FloatingWhatsApp, "wanrtxLbi8AhzrYokv6tmA+OeUo=");
_c = FloatingWhatsApp;
var _c;
__turbopack_context__.k.register(_c, "FloatingWhatsApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const checkAuth = async ()=>{
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch  {
            setUser(null);
        } finally{
            setIsLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            checkAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    error: data.error || 'Credenciais inválidas'
                };
            }
            setUser(data.user);
            return {};
        } catch  {
            return {
                error: 'Erro de conexão'
            };
        }
    };
    const logout = async ()=>{
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch  {
        // Ignore logout errors
        } finally{
            setUser(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/providers/ClientProviders.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientProviders",
    ()=>ClientProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
'use client';
;
;
function ClientProviders({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/providers/ClientProviders.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
_c = ClientProviders;
var _c;
__turbopack_context__.k.register(_c, "ClientProviders");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_09r~9.v._.js.map