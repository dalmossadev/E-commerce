# Manual de Manutenção — SHOP VAREJO
**Para o proprietário da loja — sem necessidade de programação**

> Todas as atualizações do site são feitas editando **um único arquivo**:
> `src/constants/site-config.ts`
>
> Você não precisa mexer em nenhum outro arquivo.

---

## Como abrir o arquivo de configuração

1. Abra a pasta do projeto no seu editor (VS Code recomendado)
2. Navegue até: `src` → `constants` → `site-config.ts`
3. Este arquivo é o **cérebro** do site — tudo parte daqui

---

## 1. Adicionar um novo produto

**Passo 1** — Coloque a foto do produto em:
```
public/img/catalogo/nome-do-produto.webp
```
Use o formato `.webp` para melhor performance. Tamanho ideal: **800×800px**.

**Passo 2** — No `site-config.ts`, encontre o array `PRODUCTS` e adicione um novo objeto:

```ts
{
  sku:          'PROD009',               // Código único — não repita
  name:         'Nome do Produto',
  description:  'Descrição curta e direta.',
  price:        9990,                    // Preço em centavos: 9990 = R$99,90
  originalPrice: 14990,                 // Preço antigo (opcional — para exibir o desconto)
  imageName:    'nome-do-produto.webp', // Apenas o nome do arquivo
  altText:      'Descreva a imagem para acessibilidade',
  category:     'esporte',              // Ver categorias disponíveis abaixo
  badge:        'novo',                 // 'novo' | 'oferta' | 'exclusivo' | 'esgotando' | null
  inStock:      true,                   // false = exibe "Fora de Estoque"
  featured:     false,                  // true = aparece na seção Destaques
},
```

**Passo 3** — Para exibir o produto na página, abra `src/app/page.tsx` e adicione o SKU:
```ts
// Array com TODOS os SKUs do catálogo
const ALL_SKUS = PRODUCTS.map(p => p.sku); // ← já pega todos automaticamente
```
Se quiser no destaque:
```ts
const FEATURED_SKUS = ['PROD001', 'PROD002', 'PROD003', 'PROD007', 'PROD009'];
//                                                                   ↑ adicione aqui
```

---

## 2. Alterar o preço de um produto

No array `PRODUCTS`, encontre o produto pelo nome ou SKU e mude o campo `price`:

```ts
// ANTES
price: 19990,   // R$199,90

// DEPOIS
price: 14990,   // R$149,90 (promoção)
originalPrice: 19990,  // Exibe o preço antigo riscado
```

> **Lembrete:** Os preços são sempre em **centavos**.
> R$199,90 → `19990` · R$49,00 → `4900` · R$1.200,00 → `120000`

---

## 3. Tirar um produto de estoque (sem remover do site)

```ts
inStock: false,   // Exibe "Fora de Estoque" e desabilita o botão
```

Para **remover completamente**, apague o objeto inteiro do array `PRODUCTS`.

---

## 4. Alterar o badge de um produto

```ts
badge: 'novo',       // Verde — produto novo
badge: 'oferta',     // Amarelo — em promoção
badge: 'exclusivo',  // Roxo — item especial
badge: 'esgotando',  // Vermelho — últimas unidades
badge: null,         // Sem badge
```

---

## 5. Alterar o banner principal

Encontre o array `BANNERS` e edite o primeiro item:

```ts
{
  id:           'banner-principal',
  title:        'SUPER\nSALE',       // \n = quebra de linha no título
  subtitle:     'Sua nova descrição aqui.',
  cta:          'Ver Ofertas',       // Texto do botão
  ctaHref:      '#catalogo',
  desktopImage: 'banner-novo-desktop.webp',   // Coloque em /public/img/banners/
  mobileImage:  'banner-novo-mobile.webp',
  altText:      'Descrição do banner para leitores de tela',
  priority:     true,
},
```

---

## 6. Alterar o número do WhatsApp

```ts
export const SITE_INFO = {
  //...
  whatsapp: {
    number:  '557187833065',  // DDI + DDD + número, sem espaços ou símbolos
    message: 'Olá! Vi o site e tenho interesse em um produto.',
  },
};
```

**Formato correto:** `55` (Brasil) + `71` (DDD) + `999999999` (número)

---

## 7. Alterar nome e textos do site

```ts
export const SITE_INFO = {
  name:        'NOME DA SUA LOJA',
  tagline:     'Seu slogan aqui.',
  description: 'Descrição para o Google (SEO).',
  //...
};
```

---

## 8. Categorias disponíveis

| Valor | Exibição | Ícone |
|---|---|---|
| `'esporte'` | Esporte | ⚡ |
| `'eletronicos'` | Eletrônicos | ◈ |
| `'moda'` | Moda | ◇ |
| `'beleza'` | Beleza | ◎ |
| `'casa'` | Casa | ⬡ |
| `'destaque'` | Destaque | — |

Para adicionar uma nova categoria, edite o array `CATEGORIES` no `site-config.ts`
e o tipo `ProductCategory`.

---

## 9. Onde ficam as imagens

```
public/
└── img/
    ├── catalogo/       ← fotos dos produtos
    │   ├── tenis-runner-pro.webp
    │   ├── mochila-urban-carry.webp
    │   └── ...
    └── banners/        ← banners do hero
        ├── banner-hero-desktop.webp
        ├── banner-hero-mobile.webp
        └── ...
```

**Dimensões recomendadas:**
- Produto: `800 × 800 px` (quadrado)
- Banner desktop: `1440 × 600 px`
- Banner mobile: `640 × 480 px`

> Se a imagem não existir, o site exibe um placeholder automaticamente — não quebra.

---

## 10. Subir as alterações (deploy)

Depois de editar o `site-config.ts`, abra o terminal na pasta do projeto e execute:

```bash
# Apenas para testar localmente
npm run dev

# Para fazer o deploy em produção
npm run build
npm start
```

Se o site estiver hospedado na **Vercel**, o deploy acontece automaticamente
ao fazer `git push` — não precisa de nenhum comando.

---

## Precisa de ajuda?

Se algo não funcionar como esperado, verifique:
1. ✅ O SKU do produto é único (não se repete no array)
2. ✅ O nome da imagem em `imageName` é exatamente igual ao arquivo em `/public/img/catalogo/`
3. ✅ Não há vírgulas faltando entre os objetos do array
4. ✅ O preço é um número inteiro em centavos (sem `R$`, sem ponto, sem vírgula)

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
