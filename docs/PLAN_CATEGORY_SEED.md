# 🎼 Plano: Seed de Categorias Relacionais

## Contexto
O backend foi refatorado para o Protocolo v1.6, e agora precisamos popular a tabela de categorias com os dados extraídos do frontend (`shop-varejo`) para que a integração total possa prosseguir.

## Objetivos
- [ ] Criar script de seed para categorias.
- [ ] Executar o seed no banco de dados físico (No-Mock Policy).
- [ ] Verificar a persistência via endpoint `GET /api/v1/categories`.

## Task Breakdown

### 1. Preparação (Database Architect)
- **Arquivo:** `backend/src/seed-categories.ts`
- **Ação:** Criar script TypeORM para inserir as categorias: 'destaque', 'eletronicos', 'moda', 'casa', 'esporte', 'beleza'.
- **Regra:** Usar slugs consistentes e nomes amigáveis.

### 2. Execução (Backend Specialist)
- **Comando:** `npx ts-node -r tsconfig-paths/register src/seed-categories.ts`
- **Ação:** Popular o banco de dados.

### 3. Verificação (Test Engineer)
- **Ação:** Testar a rota `GET /api/v1/categories`.
- **Esperado:** JSON com as categorias criadas e seus respectivos IDs.

## Sucesso
O plano será considerado bem-sucedido quando `GET /api/v1/categories` retornar os dados populados.
