(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * @file src/components/ui/Badge.tsx
 * @description Badge de status do produto.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
const BADGE_STYLES = {
    novo: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/40',
    oferta: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/40',
    exclusivo: 'bg-purple-500/10 text-purple-400 border border-purple-500/40',
    esgotando: 'bg-red-500/10 text-red-400 border border-red-500/40'
};
const BADGE_LABELS = {
    novo: '◈ Novo',
    oferta: '⚡ Oferta',
    exclusivo: '◇ Exclusivo',
    esgotando: '⚠ Esgotando'
};
function Badge({ type, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('badge', BADGE_STYLES[type], className),
        "aria-label": `Produto ${type}`,
        children: BADGE_LABELS[type]
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Badge.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ImageWithFallback.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImageWithFallback",
    ()=>ImageWithFallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
;
var _s = __turbopack_context__.k.signature();
/**
 * @file src/components/ui/ImageWithFallback.tsx
 * @description next/image com fallback automático em caso de erro.
 *
 * Se a imagem do produto não existir, exibe placeholder visual
 * sem quebrar a aplicação (Graceful Degradation).
 */ 'use client';
;
;
;
function ImageWithFallback({ fallbackLabel = 'Imagem indisponível', alt, ...props }) {
    _s();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "img",
            "aria-label": fallbackLabel,
            className: "w-full h-full flex flex-col items-center justify-center bg-brand-surface-2 text-brand-muted gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                    size: 40,
                    className: "opacity-30",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ImageWithFallback.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs font-mono opacity-50",
                    children: fallbackLabel
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ImageWithFallback.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/ImageWithFallback.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        ...props,
        alt: alt,
        onError: ()=>setError(true)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/ImageWithFallback.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(ImageWithFallback, "AvrsuJm02Cqlq6/LWpvA21zDecQ=");
_c = ImageWithFallback;
var _c;
__turbopack_context__.k.register(_c, "ImageWithFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/features/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/site-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ImageWithFallback$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ImageWithFallback.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/**
 * @file src/components/features/ProductCard.tsx
 * @description Card de produto orientado a SKU.
 *
 * Recebe APENAS a prop `sku` e busca todos os dados no site-config.ts.
 *
 * Princípios SOLID:
 *   SRP — só exibe um produto
 *   OCP — novos campos no config sem alterar este componente
 *   DIP — depende da abstração (getProductBySku), não dos dados diretos
 *
 * GRACEFUL DEGRADATION:
 *   - SKU inexistente → estado visual "Produto Indisponível"
 *   - Imagem com erro → placeholder via ImageWithFallback
 *   - Fora de estoque → badge + botão desabilitado
 *   - Optional chaining em todos os campos
 */ 'use client';
;
;
;
;
;
;
;
// ── Estados visuais de especificação ─────────────────────────────
function SpecRow({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between py-1 border-b border-brand-border last:border-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-brand-muted font-mono",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductCard.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-brand-text font-mono font-semibold",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductCard.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/ProductCard.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c = SpecRow;
// ── Graceful Degradation — SKU não encontrado ─────────────────────
function ProductNotFound({ sku }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "alert",
        className: "card flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[320px]",
        "aria-label": `Produto ${sku} indisponível`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                size: 36,
                className: "text-yellow-500 opacity-60",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductCard.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-display text-sm text-brand-muted tracking-widest uppercase",
                children: "Produto Indisponível"
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductCard.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-brand-muted/60 font-mono",
                children: [
                    "SKU: ",
                    sku
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/ProductCard.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/ProductCard.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c1 = ProductNotFound;
function ProductCard({ sku, className }) {
    _s();
    const [showSpecs, setShowSpecs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Busca o produto — retorna undefined se SKU não existir
    const product = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductBySku"])(sku);
    // ── Graceful Degradation: SKU inexistente ─────────────────────
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductNotFound, {
            sku: sku
        }, void 0, false, {
            fileName: "[project]/src/components/features/ProductCard.tsx",
            lineNumber: 83,
            columnNumber: 12
        }, this);
    }
    // Optional chaining em todos os acessos
    const name = product?.name ?? 'Produto';
    const description = product?.description ?? '';
    const price = product?.price ?? 0;
    const originalPrice = product?.originalPrice;
    const imageName = product?.imageName ?? '';
    const altText = product?.altText ?? `Imagem de ${name}`;
    const badge = product?.badge;
    const inStock = product?.inStock ?? false;
    const specs = product?.specs;
    const waMessage = product?.whatsappMessage;
    const discountPct = originalPrice ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcDiscount"])(originalPrice, price) : null;
    const waLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWhatsAppLink"])(waMessage ?? `Olá! Tenho interesse no produto *${name}* (SKU: ${sku}). Pode me ajudar?`);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('card group flex flex-col', className),
        "aria-label": name,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-square overflow-hidden bg-brand-surface-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ImageWithFallback$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageWithFallback"], {
                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductImageUrl"])(imageName),
                        alt: altText,
                        fill: true,
                        sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
                        className: "object-cover transition-transform duration-500 group-hover:scale-105",
                        fallbackLabel: `Imagem de ${name} indisponível`
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 left-3 z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            type: badge
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/ProductCard.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this),
                    !inStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/70 flex items-center justify-center z-20",
                        "aria-label": "Produto fora de estoque",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-display text-sm text-brand-muted tracking-widest uppercase",
                            children: "Fora de Estoque"
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/ProductCard.tsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this),
                    discountPct && inStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 right-3 z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "badge bg-red-500/90 text-white border-none text-xs",
                            children: [
                                "−",
                                discountPct,
                                "%"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/ProductCard.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/ProductCard.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col flex-1 p-4 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-xs text-brand-muted/60 tracking-widest",
                        children: [
                            "// ",
                            sku
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-display text-base font-bold text-brand-text leading-tight tracking-wide line-clamp-2",
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-brand-muted leading-relaxed line-clamp-2 flex-1",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-baseline gap-2",
                        "aria-label": `Preço: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(price)}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-xl font-bold text-brand-primary tracking-tight",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(price)
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/ProductCard.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            originalPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-sm text-brand-muted line-through",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(originalPrice)
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/ProductCard.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    specs && Object.keys(specs).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowSpecs((v)=>!v),
                                className: "flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-primary transition-colors font-mono",
                                "aria-expanded": showSpecs,
                                "aria-controls": `specs-${sku}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                        size: 12,
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/features/ProductCard.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this),
                                    showSpecs ? 'Ocultar specs' : 'Ver especificações'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/features/ProductCard.tsx",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this),
                            showSpecs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: `specs-${sku}`,
                                className: "mt-2 p-3 bg-brand-background/60 rounded-lg border border-brand-border",
                                children: Object.entries(specs).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpecRow, {
                                        label: k,
                                        value: v
                                    }, k, false, {
                                        fileName: "[project]/src/components/features/ProductCard.tsx",
                                        lineNumber: 201,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/ProductCard.tsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-2 mt-auto pt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                as: "a",
                                href: waLink,
                                target: "_blank",
                                variant: "primary",
                                size: "sm",
                                fullWidth: true,
                                disabled: !inStock,
                                "aria-disabled": !inStock,
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                    size: 14,
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/ProductCard.tsx",
                                    lineNumber: 219,
                                    columnNumber: 23
                                }, this),
                                children: inStock ? 'Comprar via WA' : 'Indisponível'
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/ProductCard.tsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                as: "a",
                                href: waLink,
                                target: "_blank",
                                variant: "outline",
                                size: "sm",
                                "aria-label": `Ver detalhes de ${name} no WhatsApp`,
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                    size: 14,
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/ProductCard.tsx",
                                    lineNumber: 231,
                                    columnNumber: 23
                                }, this),
                                children: "Detalhes"
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/ProductCard.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/features/ProductCard.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/ProductCard.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/ProductCard.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(ProductCard, "XelysAoLgo28OVjrtBA2mOSWYDw=");
_c2 = ProductCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SpecRow");
__turbopack_context__.k.register(_c1, "ProductNotFound");
__turbopack_context__.k.register(_c2, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/features/CategoryFilter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoryFilter",
    ()=>CategoryFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/site-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
/**
 * @file src/components/features/CategoryFilter.tsx
 * @description Filtro de categorias — Client Component.
 * Filtra os produtos exibidos sem redirecionar (estado local).
 */ 'use client';
;
;
;
function CategoryFilter({ current, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "group",
        "aria-label": "Filtrar por categoria",
        className: "flex items-center gap-2 flex-wrap",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono text-xs text-brand-muted tracking-widest mr-2 hidden sm:inline",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-brand-primary",
                        children: '>'
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/CategoryFilter.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    " filtrar:"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/CategoryFilter.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORIES"].map((cat)=>{
                const active = current === cat.value;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>onChange(cat.value),
                    "aria-pressed": active,
                    "aria-label": `Filtrar por ${cat.label}`,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('font-mono text-xs px-3 py-1.5 rounded-md', 'border transition-all duration-200', 'tracking-wider uppercase', active ? 'border-brand-primary text-brand-primary bg-brand-primary/10 shadow-neon-sm' : 'border-brand-border text-brand-muted bg-brand-surface/50 hover:border-brand-primary/50 hover:text-brand-text'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            "aria-hidden": "true",
                            children: [
                                cat.icon,
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/CategoryFilter.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, this),
                        cat.label
                    ]
                }, cat.value, true, {
                    fileName: "[project]/src/components/features/CategoryFilter.tsx",
                    lineNumber: 30,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/CategoryFilter.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = CategoryFilter;
var _c;
__turbopack_context__.k.register(_c, "CategoryFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/features/ProductGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductGrid",
    ()=>ProductGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$features$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/features/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$features$2f$CategoryFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/features/CategoryFilter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/site-config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/**
 * @file src/components/features/ProductGrid.tsx
 * @description Grid de produtos com filtro de categoria.
 * Client Component — estado do filtro é local (sem URL).
 *
 * Recebe array de SKUs → ProductCard busca os dados no config.
 * Para alterar produtos exibidos → edite os SKUs na page.tsx.
 */ 'use client';
;
;
;
;
function ProductGrid({ skus }) {
    _s();
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('todos');
    // Filtra os SKUs pela categoria selecionada
    const filteredSkus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductGrid.useMemo[filteredSkus]": ()=>{
            if (activeCategory === 'todos') return skus;
            return skus.filter({
                "ProductGrid.useMemo[filteredSkus]": (sku)=>{
                    const product = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$site$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductBySku"])(sku);
                    return product?.category === activeCategory;
                }
            }["ProductGrid.useMemo[filteredSkus]"]);
        }
    }["ProductGrid.useMemo[filteredSkus]"], [
        skus,
        activeCategory
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$features$2f$CategoryFilter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CategoryFilter"], {
                        current: activeCategory,
                        onChange: setActiveCategory
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/ProductGrid.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-xs text-brand-muted",
                        "aria-live": "polite",
                        "aria-atomic": "true",
                        children: [
                            filteredSkus.length,
                            " produto",
                            filteredSkus.length !== 1 ? 's' : '',
                            activeCategory !== 'todos' && ` em ${activeCategory}`
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/features/ProductGrid.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/ProductGrid.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            filteredSkus.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                role: "list",
                "aria-label": `${filteredSkus.length} produtos`,
                children: filteredSkus.map((sku, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        role: "listitem",
                        style: {
                            animationDelay: `${i * 60}ms`
                        },
                        className: "animate-fade-up",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$features$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductCard"], {
                            sku: sku,
                            className: "h-full"
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/ProductGrid.tsx",
                            lineNumber: 65,
                            columnNumber: 15
                        }, this)
                    }, sku, false, {
                        fileName: "[project]/src/components/features/ProductGrid.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductGrid.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyState, {
                category: activeCategory,
                onReset: ()=>setActiveCategory('todos')
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductGrid.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/ProductGrid.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(ProductGrid, "5cDo7h6gW9RlYxB/3RtdiJeME7c=");
_c = ProductGrid;
// ── Estado vazio ─────────────────────────────────────────────────
function EmptyState({ category, onReset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-live": "polite",
        className: "flex flex-col items-center justify-center py-24 gap-4 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-mono text-6xl text-brand-muted/20 select-none",
                "aria-hidden": "true",
                children: "[ ]"
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductGrid.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-display text-brand-muted text-sm tracking-widest uppercase",
                children: [
                    'Nenhum produto em "',
                    category,
                    '"'
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/ProductGrid.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onReset,
                className: "font-mono text-xs text-brand-primary underline underline-offset-4 hover:text-brand-neon-dim transition-colors",
                children: "Ver todos os produtos"
            }, void 0, false, {
                fileName: "[project]/src/components/features/ProductGrid.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/ProductGrid.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c1 = EmptyState;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductGrid");
__turbopack_context__.k.register(_c1, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_12cw7yf._.js.map