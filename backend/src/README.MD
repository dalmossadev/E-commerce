# Estrutura de Código Fonte (Src)

Este diretório contém a implementação da API seguindo os princípios de **Clean Architecture** e **SOLID**.

## Fluxo da Requisição:
HTTP Request -> Routes -> Middlewares -> Controllers -> Use Cases (Core) -> Repositories (TypeORM) -> MySQL

```
src/
├── core/                      # Regras de negócio puras (Clean Architecture)
│   ├── domain/                # Entidades e objetos de valor
│   ├── use-cases/             # Casos de uso (orders, procurement, catalog)
│   ├── dto/                   # Data Transfer Objects
│   ├── interfaces/            # Contratos e interfaces
│   ├── errors/                # Erros específicos do domínio
│   └── container/             # Injeção de dependências
│
├── adapters/                  # Adaptadores de entrada/saída
│   └── http/                  # Camada HTTP (Express)
│       ├── controllers/       # Controladores das rotas
│       ├── routes/            # Registro das rotas por domínio
│       ├── middlewares/       # Auth, validação, logging, rate limit
│       └── validations/       # Esquemas de validação
│
├── infrastructure/            # Implementações concretas
│   ├── database/             # TypeORM, models, mappers, repositories
│   ├── logger/               # Winston configurado
│   ├── swagger/              # Configuração do Swagger
│   └── upload/               # Configuração de upload
│
├── docs/                      # Documentação e contratos
├── server.ts                  # Ponto de entrada da aplicação
└── seed.ts                    # Script de seed do banco de dados
```

## Principais Comandos:
- Iniciar Servidor: `npm run dev`
- Build: `npm run build`
- Rodar Testes: `npm test`
- Testes com cobertura: `npm run test:coverage`