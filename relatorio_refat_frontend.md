# Relatório de Refatoração do Frontend - Shop Varejo
**Data:** 29/04/2026  
**Objetivo:** Corrigir a lógica de carregamento de imagens nos cards de produtos, garantindo o uso correto de `imageUrl` do banco de dados, fallback para imagem padrão e uso do componente `ImageWithFallback`.

---

## 1. Arquivos Analisados
Conforme solicitado, todos os arquivos abaixo foram lidos antes de qualquer alteração:

### Backend (apenas leitura, nenhuma alteração realizada)
| Arquivo | Descrição |
|---------|-----------|
| `backend/src/core/domain/Product.ts` | Confirmação de campos `imageName` (linha 15) e `imageUrl` (linha 16) na entidade Product |
| `backend/src/infrastructure/database/mappers/ProductSchema.ts` | Mapeamento de `imageName` (linha 16) e `imageUrl` (linha 17) no schema TypeORM |
| `backend/src/core/dto/ProductDTO.ts` | Verificação de que o `ProductResponseDTO` **não inclui** `imageUrl` ou `imageName` (pendência no backend, não alterada conforme instrução) |

### Frontend
| Arquivo | Descrição |
|---------|-----------|
| `shop-varejo/src/components/features/ProductCard.tsx` | Componente principal de card de produto (único arquivo modificado) |
| `shop-varejo/src/components/ui/ImageWithFallback.tsx` | Componente de imagem com fallback para erros 404 (já existente, sem alterações) |
| `shop-varejo/src/constants/site-config.ts` | Configuração de URLs de imagens e helpers (apenas leitura) |
| `shop-varejo/src/modules/product-controller.ts` | Controlador de produtos (apenas leitura) |
| `shop-varejo/public/img/catalogo/` | Verificação de imagens existentes (nenhuma movida/renomeada/excluída) |

---

## 2. Análise de Requisitos e Problemas
1. **Confirmação de campos no backend**:
   - A entidade `Product` possui `imageName` (string, linha 15) e `imageUrl` (string opcional, linha 16)
   - Ambos os campos estão mapeados em `ProductSchema` para o banco de dados
   - O `ProductResponseDTO` não retorna esses campos (limitação do backend, não alterada)

2. **Problemas na lógica anterior de `ProductCard.tsx`**:
   - Usava `imageUrl || getProductImageUrl(imageName)`, onde `getProductImageUrl` dependia de `imageName` em vez de `imageUrl` (conforme solicitado, `imageUrl` é o filename armazenado no banco)
   - Dependência desnecessária de helper do `site-config.ts`

---

## 3. Alterações Realizadas (Apenas Frontend)
**Arquivo modificado**: `shop-varejo/src/components/features/ProductCard.tsx`

### 3.1 Adição de lógica para `imageSrc`
Implementada variável que constrói o caminho da imagem conforme solicitado:
```tsx
// Build image src: use imageUrl filename, fallback to default
const imageSrc = imageUrl
  ? `/img/catalogo/${imageUrl}`
  : '/img/catalogo/produto-default.webp';
```
- Quando `imageUrl` existe (filename do banco de dados), utiliza `/img/catalogo/{imageUrl}`
- Quando `imageUrl` é nulo/undefined, faz fallback para `/img/catalogo/produto-default.webp`

### 3.2 Atualização do componente `ImageWithFallback`
Substituído o `src` anterior pelo novo `imageSrc`:
```tsx
<ImageWithFallback
  src={imageSrc}
  alt={altText}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover transition-transform duration-700 group-hover:scale-110"
  fallbackLabel={`Imagem de ${name} indisponível`}
/>
```

### 3.3 Remoção de importação não utilizada
Removida a importação de `getProductImageUrl` do `site-config.ts`:
```tsx
// Antes
import { getProductBySku, getProductImageUrl, getWhatsAppLink, formatPrice, calcDiscount } from '@/constants/site-config';

// Depois
import { getProductBySku, getWhatsAppLink, formatPrice, calcDiscount } from '@/constants/site-config';
```

---

## 4. Verificação de Requisitos Atendidos
| Requisito | Status | Detalhes |
|----------|--------|----------|
| Confirmar Product entity tem imageUrl/imageName | ✅ | Campos confirmados em `Product.ts` e `ProductSchema.ts` |
| Build src como `/img/catalogo/{product.imageUrl}` | ✅ | Implementado em `imageSrc` |
| Fallback para `/img/catalogo/produto-default.webp` | ✅ | Implementado quando `imageUrl` é nulo/undefined |
| Imagens em `public/img/catalogo/`, Next.js serve public/ na raiz | ✅ | Caminho `/img/catalogo/` confirmado como correto |
| Usar `ImageWithFallback` para tratar 404s | ✅ | Componente já existente, utilizado corretamente |
| Não mover/renomear/excluir imagens | ✅ | Diretório `public/img/catalogo/` inalterado |
| Não alterar backend | ✅ | Apenas arquivos frontend modificados |

---

## 5. Observações
- O `ProductResponseDTO` no backend não inclui `imageUrl` ou `imageName`, o que impedirá o carregamento correto de imagens via API até que esse campo seja adicionado no DTO (não realizado conforme instrução de não tocar no backend)
- O componente `ImageWithFallback` já trata erros 404 de forma graciosa, exibindo um placeholder visual
- Todas as alterações foram restritas ao frontend, conforme solicitado
