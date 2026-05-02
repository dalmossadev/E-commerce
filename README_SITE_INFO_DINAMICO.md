# SITE_INFO Dinâmico - Documentação

## Visão Geral

O sistema anteriormente utilizava uma constante estática no arquivo `site-config.ts`. Agora, as informações do site são armazenadas no banco de dados e podem ser editadas facilmente através de uma interface web, sem necessidade de conhecimento em programação.

## Arquitetura

### Backend (API)
- **Entidade**: Reutiliza a tabela `settings` já existente no banco
- **Chaves criadas**:
  - `site_name` - Nome do site
  - `site_tagline` - Slogan/tagline
  - `site_description` - Descrição para SEO
  - `site_whatsapp_number` - Número do WhatsApp (com DDD)
  - `site_whatsapp_message` - Mensagem padrão do WhatsApp
  - `site_instagram_url` - URL do Instagram

### Novos Endpoints
- `GET /api/settings/site-info` - Retorna todas as configurações consolidadas
- `PUT /api/settings/site-info` - Atualiza as configurações (parcial ou total)

### Frontend
- **Hook personalizado**: `useSiteInfo()` em `/src/hooks/useSiteInfo.ts`
- **Página Admin**: `/admin/site-info` para edição fácil
- **Componentes atualizados**: Header, Footer, FloatingWhatsApp, e page.tsx agora consomem dados dinâmicos

## Como Usar

### 1. Popular o Banco de Dados (Seed)

Execute o script de seed para criar as configurações iniciais:

```bash
cd /home/dalmo/Documentos/Projetos/sisters-lab-completo/backend
npx ts-node src/seed-site-info.ts
```

Isso criará as chaves no banco com os valores padrão.

### 2. Editar via Interface Web

1. Inicie o frontend (shop-varejo)
2. Acesse: `http://localhost:3000/admin/site-info`
3. Edite os campos desejados:
   - Nome do Site
   - Tagline
   - Descrição
   - Número do WhatsApp
   - Mensagem do WhatsApp
   - URL do Instagram
4. Clique em "Salvar Configurações"

### 3. Fallback Automático

Se a API estiver indisponível, o sistema usa automaticamente os valores estáticos definidos em `site-config.ts` como fallback.

## Estrutura de Arquivos Modificados

### Backend
- `backend/src/seed-site-info.ts` - Script para popular o banco
- `backend/src/core/use-cases/settings/SiteInfoUseCases.ts` - Lógica de negócio
- `backend/src/adapters/http/controllers/SettingsController.ts` - Controlador atualizado
- `backend/src/adapters/http/routes/settings.routes.ts` - Novas rotas
- `backend/src/core/container/Container.ts` - Registro dos novos use cases

### Frontend
- `shop-varejo/src/hooks/useSiteInfo.ts` - Hook para buscar configurações
- `shop-varejo/src/app/admin/site-info/page.tsx` - Página de administração
- `shop-varejo/src/components/layout/Header.tsx` - Atualizado para usar hook
- `shop-varejo/src/components/layout/Footer.tsx` - Atualizado para usar hook
- `shop-varejo/src/components/features/FloatingWhatsApp.tsx` - Atualizado
- `shop-varejo/src/app/page.tsx` - Atualizado

## Vantagens da Nova Abordagem

1. **Fácil edição**: Qualquer pessoa com conhecimento básico de informática pode alterar
2. **Sem código**: Não precisa editar arquivos `.ts` ou recompilar
3. **Persistência**: Dados salvos no banco de dados
4. **Tempo real**: Alterações refletem imediatamente no site
5. **Fallback seguro**: Se a API falhar, usa valores estáticos

## Manutenção

### Adicionar Novo Campo
1. Adicione a chave no `seed-site-info.ts`
2. Atualize a interface `SiteInfo` em `SiteInfoUseCases.ts` e `useSiteInfo.ts`
3. Adicione o campo na página admin (`/admin/site-info/page.tsx`)

### Backup
As configurações estão na tabela `settings`. Faça backup regular do banco de dados.

## Exemplo de Uso do Hook

```typescript
import { useSiteInfo } from '@/hooks/useSiteInfo';

function MeuComponente() {
  const { siteInfo, loading, error } = useSiteInfo();
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return <h1>{siteInfo.name}</h1>;
}
```

## Segurança

A página de administração (`/admin/site-info`) deve ser protegida com autenticação em ambiente de produção. Atualmente, qualquer pessoa pode acessar. Considere adicionar:
- Middleware de autenticação
- Proteção por senha
- Autenticação JWT existente no backend
