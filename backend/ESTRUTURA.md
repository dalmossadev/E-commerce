# Estrutura de Arquivos - Sisters Lab
Gerado em: 25/04/2026 17:14:11

## 1. Visão Geral (Árvore)
```text
.
├── ESTRUTURA.md
├── generate_structure.sh
├── logs
│   ├── combined.log
│   └── error.log
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── api_test.http
│   ├── core
│   │   ├── entities
│   │   │   ├── AuditLog.ts
│   │   │   ├── Campaign.ts
│   │   │   ├── Customer.ts
│   │   │   ├── ProductHistory.ts
│   │   │   ├── Product.ts
│   │   │   ├── ProductVariant.ts
│   │   │   ├── Settings.ts
│   │   │   ├── Supplier.ts
│   │   │   ├── UserProfile.ts
│   │   │   └── User.ts
│   │   ├── interfaces
│   │   │   ├── IProductRepository.ts
│   │   │   ├── IProductSKU.ts
│   │   │   └── README.MD
│   │   ├── README.MD
│   │   ├── services
│   │   │   └── SkuService.ts
│   │   └── use-cases
│   │       ├── CreateProductUseCase.ts
│   │       ├── GetProductBySkuUseCase.ts
│   │       ├── ListProductsUseCase.ts
│   │       └── SeedProductsUseCase.ts
│   ├── docs
│   │   └── contracts
│   │       └── PRODUCT_VARIANT_MIGRATION.MD
│   ├── infrastructure
│   │   ├── database
│   │   │   ├── data-source.ts
│   │   │   ├── entities
│   │   │   ├── http
│   │   │   ├── mappers
│   │   │   ├── migraations
│   │   │   ├── README.md
│   │   │   ├── repositories
│   │   │   ├── server-init.ts
│   │   │   └── subscribers
│   │   ├── logger
│   │   │   └── logger.ts
│   │   ├── middlewares
│   │   │   └── README.MD
│   │   └── README.MD
│   ├── interfaces
│   │   ├── controllers
│   │   └── http
│   │       ├── middlewares
│   │       ├── routes
│   │       └── validations
│   ├── README.MD
│   ├── seed.ts
│   ├── server.ts
│   └── shared
│       ├── AppError.ts
│       └── README_Shared.MD
└── tsconfig.json

27 directories, 40 files
```

## 2. Detalhes dos Diretórios Principais
| Diretório | Responsabilidade (Clean Arch) |
|-----------|-------------------------------|
| src/domain | Entidades de negócio e interfaces de repositórios |
| src/application | Casos de Uso (Use Cases) e serviços da aplicação |
| src/infrastructure | Implementações de BD (TypeORM), Subscribers e Repositórios |
| src/presentation | Controllers, Rotas e Middlewares (Express) |
| src/shared | Utilitários, Erros globais e DTOs comuns |

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
