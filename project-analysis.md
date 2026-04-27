# Sisters Lab — Project Analysis
_Gerado em: seg 27 abr 2026 15:27:16 -03_

## BACKEND

### Estrutura de pastas
```
src/adapters/http/controllers/LeadController.ts
src/adapters/http/controllers/OrderController.ts
src/adapters/http/controllers/ProductController.ts
src/adapters/http/controllers/PurchaseController.ts
src/adapters/http/controllers/SupplierController.ts
src/adapters/http/middlewares/AuthMiddleware.ts
src/adapters/http/middlewares/ErrorHandler.ts
src/adapters/http/middlewares/LogMiddleware.ts
src/adapters/http/middlewares/RateLimitMiddleware.ts
src/adapters/http/middlewares/ValidationMiddleware.ts
src/adapters/http/routes/admin.routes.ts
src/adapters/http/routes/auth.routes.ts
src/adapters/http/routes/health.routes.ts
src/adapters/http/routes/lead.routes.ts
src/adapters/http/routes/order.routes.ts
src/adapters/http/routes/product.routes.ts
src/adapters/http/routes/purchase.routes.ts
src/adapters/http/routes/supplier.routes.ts
src/adapters/http/routes/user.routes.ts
src/adapters/http/validations/lead.validation.ts
src/adapters/http/validations/order.validation.ts
src/adapters/http/validations/product.validation.ts
src/adapters/http/validations/purchase.validation.ts
src/adapters/http/validations/supplier.validation.ts
src/core/container/Container.ts
src/core/domain/AuditLog.ts
src/core/domain/Campaign.ts
src/core/domain/Customer.ts
src/core/domain/Lead.ts
src/core/domain/Order.ts
src/core/domain/ProductHistory.ts
src/core/domain/Product.ts
src/core/domain/ProductVariant.ts
src/core/domain/Purchase.ts
src/core/domain/services/SkuService.ts
src/core/domain/Settings.ts
src/core/domain/Supplier.ts
src/core/domain/UserProfile.ts
src/core/domain/User.ts
src/core/dto/AuthDTO.ts
src/core/dto/LeadDTO.ts
src/core/dto/OrderDTO.ts
src/core/dto/ProductDTO.ts
src/core/dto/PurchaseDTO.ts
src/core/dto/SupplierDTO.ts
src/core/errors/AppError.ts
src/core/errors/CustomErrors.ts
src/core/interfaces/IAuditRepository.ts
src/core/interfaces/IAuthService.ts
src/core/interfaces/ILeadRepository.ts
src/core/interfaces/IOrderRepository.ts
src/core/interfaces/IProductRepository.ts
src/core/interfaces/IProductSKU.ts
src/core/interfaces/IPurchaseRepository.ts
src/core/interfaces/ISupplierRepository.ts
src/core/interfaces/IUserRepository.ts
src/core/use-cases/AuthUseCases.ts
src/core/use-cases/catalog/DeleteProductUseCase.ts
src/core/use-cases/catalog/UpdateProductUseCase.ts
src/core/use-cases/CreateProductUseCase.ts
src/core/use-cases/GetProductBySkuUseCase.ts
src/core/use-cases/LeadUseCases.ts
src/core/use-cases/ListProductsUseCase.ts
src/core/use-cases/orders/OrderUseCases.ts
src/core/use-cases/procurement/CreatePurchaseOrderUseCase.ts
src/core/use-cases/procurement/ListPurchasesUseCase.ts
src/core/use-cases/procurement/ReceiveInventoryUseCase.ts
src/core/use-cases/SeedProductsUseCase.ts
src/core/use-cases/SupplierUseCases.ts
src/infrastructure/auth/AuthService.ts
src/infrastructure/cache/cache.ts
src/infrastructure/database/data-source.ts
src/infrastructure/database/mappers/AuditBaseSchema.ts
src/infrastructure/database/mappers/AuditEntrySchema.ts
src/infrastructure/database/mappers/AuditLogSchema.ts
src/infrastructure/database/mappers/CampaignSchema.ts
src/infrastructure/database/mappers/CustomerSchema.ts
src/infrastructure/database/mappers/LeadSchema.ts
src/infrastructure/database/mappers/OrderItemSchema.ts
src/infrastructure/database/mappers/OrderSchema.ts
src/infrastructure/database/mappers/ProductHistorySchema.ts
src/infrastructure/database/mappers/ProductSchema.ts
src/infrastructure/database/mappers/ProductVariantSchema.ts
src/infrastructure/database/mappers/PurchaseItemSchema.ts
src/infrastructure/database/mappers/PurchaseSchema.ts
src/infrastructure/database/mappers/SettingsSchema.ts
src/infrastructure/database/mappers/SupplierSchema.ts
src/infrastructure/database/mappers/UserProfileSchema.ts
src/infrastructure/database/mappers/UserSchema.ts
src/infrastructure/database/mappers/VariantHistorySchema.ts
src/infrastructure/database/models/AuditLogModel.ts
src/infrastructure/database/repositories/TypeORMAuditRepository.ts
src/infrastructure/database/repositories/TypeORMLeadRepository.ts
src/infrastructure/database/repositories/TypeORMOrderRepository.ts
src/infrastructure/database/repositories/TypeORMProductRepository.ts
src/infrastructure/database/repositories/TypeORMPurchaseRepository.ts
src/infrastructure/database/repositories/TypeORMSupplierRepository.ts
src/infrastructure/database/repositories/TypeORMUserRepository.ts
src/infrastructure/database/server-init.ts
src/infrastructure/database/subscribers/VariantAuditSubscriber.ts
src/infrastructure/logger/logger.ts
src/infrastructure/swagger/swagger.ts
src/infrastructure/upload/upload.ts
src/seed.ts
src/server.ts
src/__tests__/integration/leads.test.ts
src/__tests__/integration/orders.test.ts
src/__tests__/integration/purchases.test.ts
src/__tests__/performance.test.ts
src/__tests__/setup.ts
src/__tests__/unit/controllers/product.controller.test.ts
src/__tests__/unit/CreateLeadUseCase.test.ts
src/__tests__/unit/CreateOrderUseCase.test.ts
src/__tests__/unit/lead.test.ts
src/__tests__/unit/order.test.ts
src/__tests__/unit/purchase.test.ts
src/__tests__/unit/ReceiveInventoryUseCase.test.ts
```

### Rotas registradas
```
app.get('/api-docs.json', (req: express.Request, res: express.Response) => {
```

### Endpoints de autenticação
```
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/adapters/http/routes/user.routes.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/adapters/http/routes/auth.routes.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/adapters/http/middlewares/AuthMiddleware.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/adapters/http/middlewares/RateLimitMiddleware.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/dto/AuthDTO.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/interfaces/IAuthService.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/errors/CustomErrors.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/use-cases/AuthUseCases.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/container/Container.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/server.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/infrastructure/auth/AuthService.ts
```

### DTOs exportados
```
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/dto/AuthDTO.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/dto/LeadDTO.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/dto/OrderDTO.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/dto/ProductDTO.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/dto/PurchaseDTO.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/dto/SupplierDTO.ts
```

### Entidades de domínio
```
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/AuditLog.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Campaign.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Customer.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Lead.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Order.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/ProductHistory.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Product.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/ProductVariant.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Purchase.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/services/SkuService.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Settings.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/Supplier.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/UserProfile.ts
/home/dalmo/Documentos/Projetos/sisters-lab-completo/backend/src/core/domain/User.ts
```

### package.json (backend)
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "dev": "ts-node -r tsconfig-paths/register src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@types/bcryptjs": "^3.0.0",
    "@types/express": "^5.0.6",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.1.0",
    "@types/node": "^25.6.0",
    "@types/supertest": "^6.0.2",
    "better-sqlite3": "^12.9.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.4",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "tsconfig-paths": "^4.2.0",
    "tsx": "^4.21.0",
    "typescript": "^5.4.5"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.22.2",
    "pg": "^8.20.0",
    "reflect-metadata": "^0.2.2",
    "sqlite3": "^5.1.7",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "typeorm": "^0.3.28",
    "winston": "^3.19.0",
    "zod": "^4.3.6"
  }
}
```

### Variáveis de ambiente esperadas (.env.example)
```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=dalmo
DB_PASS=dalmo123
DB_NAME=sisterslabdb


JWT_ACCESS_SECRET=''
JWT_REFRESH_SECRET=''
JWT_ACCESS_EXPIRES_IN='15M'
JWT_REFRESH_EXPIRES_IN='7d'

GIT_ACCESS_SECRET_TOKEN='[TOKEN_OMITIDO]'
git push https://[TOKEN_OMITIDO]@github.com/dalmossadev/E-commerce.git main

## FRONTEND (shop-varejo)

### Estrutura de pastas
```
src/app/layout.tsx
src/app/not-found.tsx
src/app/page.tsx
src/components/features/CategoryFilter.tsx
src/components/features/FeaturedSection.tsx
src/components/features/FloatingWhatsApp.tsx
src/components/features/HeroBanner.tsx
src/components/features/ProductCard.tsx
src/components/features/ProductGrid.tsx
src/components/layout/Footer.tsx
src/components/layout/Header.tsx
src/components/ui/Badge.tsx
src/components/ui/Button.tsx
src/components/ui/ImageWithFallback.tsx
src/constants/site-config.ts
src/lib/utils.ts
src/modules/product-controller.ts
src/types/interfaces.ts
```

### Chamadas de API existentes (fetch/axios)
```
// and also overrides baseURL if TS_NODE_BASEURL is available.
*   await fetch('some/uri', { signal: t.signal });
baseURL?: string;
* `cache.fetch()` and `cache.memo()`.
* `cache.fetch(k)` into just an async wrapper around `cache.get(k)`) or
* calls to `cache.fetch()` _must_ provide a `context` option. If
* can be used, which will reject if `this.fetch()` resolves to undefined.
*     const res = await fetch(`https://slow-backend-server/${key}`)
*     const res = await fetch(url, { signal })
* const response = await fetch('...')
const response = await fetch(`${this.endpoint}/${sku}`);
const response = await fetch(`${this.endpoint}/${sku}`, {
const response = await fetch(this.endpoint);
const response = await fetch(this.endpoint, {
* const result = cache.fetch('https://example.com/')
constructor(init?: URLPatternInput, baseURL?: string);
* const val = await c.fetch('key', { signal: AbortSignal.timeout(100) })
declare function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
* determined by the FIRST fetch() call for a given key.
exec(input?: URLPatternInput, baseURL?: string): URLPatternResult | null;
export declare function createRouteTreePrefetch(loaderTree: LoaderTree, hintTree: PrefetchHints | null, getDynamicParamFromSegment: GetDynamicParamFromSegment): Promise<FlightRouterState>;
export declare function prefetch(href: string, nextUrl: string | null, treeAtTimeOfPrefetch: FlightRouterState, fetchStrategy: PrefetchTaskFetchStrategy, onInvalidate: null | (() => void)): void;
fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
fetch(k: K, fetchOptions: unknown extends FC ? LRUCache.FetchOptions<K, V, FC> : FC extends undefined | void ? LRUCache.FetchOptionsNoContext<K, V> : LRUCache.FetchOptionsWithContext<K, V, FC>): Promise<undefined | V>;
fetch(k: unknown extends FC ? K : FC extends undefined | void ? K : never, fetchOptions?: unknown extends FC ? LRUCache.FetchOptions<K, V, FC> : FC extends undefined | void ? LRUCache.FetchOptionsNoContext<K, V> : never): Promise<undefined | V>;
* `fetch()` will resolve to `undefined`. Ie, all `fetchMethod` errors are
function fetch(
* If a `signal` is passed to the `fetch()` call, then aborting the
* If `fetchMethod` is not provided, then `cache.fetch(key)` is equivalent
* If you call `fetch()` multiple times with the same key value,
* #include <js_native_api.h>
* - inflight: there is another fetch() for this key which is in process
* In some cases, `cache.fetch()` may resolve to `undefined`, either because
*     // note: do NOT pass the signal to fetch()!
* **Note: `fetch()` calls are inflight-unique**
* Note that this can change as the underlying fetch() moves through
* @param href The href passed to <Link>, router.prefetch(), or similar
prefetch(href: string, options?: PrefetchOptions): void;
prefetch(route: string): Promise<void>;
prefetch(url: string, asPath?: string, options?: PrefetchOptions): Promise<void>;
* Provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using fetch().
* receive an `abort` event, and the promise returned by `fetch()`
* relevant for the course of a single `fetch()` operation, and
* signal will abort the fetch and cause the `fetch()` promise to
* since that was the fallback value _at the moment the `fetch()` was
test(input?: URLPatternInput, baseURL?: string): boolean;
* the first place). If you are changing the fetch() options
* The reason for a fetch() rejection.  Either the error raised by the
* The static, read-only **`highlights`** property of the CSS interface provides access to the `HighlightRegistry` used to style arbitrary text ranges using the css_custom_highlight_api.
* - the `use` property is configured with a baseURL matching the expected dev server endpoint (http://127.0.0.1:3000)
* This may be set in calls to `fetch()`, or defaulted on the constructor,
* webpack-compatible api.
* You may want to disable HTTP Keep-Alive for certain `fetch()` calls or globally.
```

### Variáveis de ambiente do frontend
```
# ══════════════════════════════════════════
# SHOP VAREJO — Variáveis de Ambiente
# ══════════════════════════════════════════
# Copie para .env.local e preencha os valores.
# NUNCA commite .env.local no Git.

# ── App ────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Imagens (opcional — para CDN externo) ──
# Se deixar em branco, usa /public/img/catalogo/
# NEXT_PUBLIC_IMAGE_CDN_URL=https://sua-cdn.com/img

# ── Analytics (opcional) ───────────────────
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Páginas / rotas Next.js
```
.next/types/app/page.ts
src/app/page.tsx
```

### package.json (frontend)
```json
{
  "name": "shop-varejo",
  "version": "1.0.0",
  "description": "E-commerce Config-Driven · Next.js · Tailwind · SOLID",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "lucide-react": "^0.383.0",
    "next": "^16.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.5",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

## GAP ANALYSIS

### Rotas backend sem consumo no frontend
```
'/api/v1/leads'
'/api/v1/orders'
'/api/v1/purchases'
```

### Resumo

| Item | Valor |
|------|-------|
| Arquivos TypeScript backend | 117 |
| Arquivos TypeScript/TSX frontend | 25 |
| Backend URL esperada | http://localhost:3000 |
| Frontend URL esperada | http://localhost:3001 |

