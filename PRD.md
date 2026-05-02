# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD) - SHOP-VAREJO P&B

**Status:** Draft | **Version:** 1.1 | **Owner:** Dalmo (CTO/DevOps) | **PO:** Gemini Assistant

---

## 1. VISION & OBJECTIVE
Criar um e-commerce de calçados premium, minimalista e ultra-acessível para o mercado de Salvador e Simões Filho, BA. O modelo baseia-se em **estoque zero local** (cross-docking) e **venda ativa via WhatsApp**.

## 2. TARGET AUDIENCE
- **Clientes:** Consumidores locais que buscam qualidade com entrega rápida.
- **Público A11Y:** Pessoas com baixa visão ou necessidades de navegação assistida.
- **Vendedores:** Operadores que utilizam o dashboard para converter leads via WhatsApp.

## 3. USER STORIES (MVP)
- **Como Cliente,** quero ver detalhes da textura do calçado (Zoom) para confiar no material.
- **Como Cliente com baixa visão,** quero aumentar a fonte (A+/A-) sem quebrar o layout.
- **Como Vendedor,** quero ser notificado de carrinhos abandonados para agir via WhatsApp.
- **Como Admin (Dalmo),** quero subir o ambiente via Docker para garantir consistência.

## 4. FUNCTIONAL REQUIREMENTS (FR)
- **FR-01: Identidade Visual (Cores):** ✅ CONGELADA. As cores atuais são imutáveis e devem ser a base de toda a interface.
- **FR-02: Moldura e Layout:** 🛠️ FLEXÍVEL. Os especialistas de UX e UI têm liberdade técnica para remodelar a estrutura, componentes e disposição dos elementos para maximizar a conversão e usabilidade.
- **FR-03: Acessibilidade:** Botões de zoom global e Image Magnifier (Lupa).
- **FR-04: Estoque:** Integração com Supabase e badge "Pronta Entrega" regional.
- **FR-05: Conversão:** Botão "Comprar" direciona para WhatsApp com ID do produto.
- **FR-06: Wishlist:** Usuários autenticados podem adicionar/remover produtos da lista de desejos via `POST /api/v1/wishlist` e `DELETE /api/v1/wishlist`.

## 5. NON-FUNCTIONAL REQUIREMENTS (NFR)
- **Performance:** Carregamento de imagens < 1.5s (WebP).
- **Infrastructure:** Aplicação 100% conteinerizada (Docker).
- **Architecture:** Padrão MVC com TypeORM e Next.js App Router.
- **Development:** Orquestração de agentes via **Antigravity (Goal-Oriented)**.

## 6. DATA MODEL (High-Level)
- **Users:** (id, name, email, role[ADMIN, SELLER, CUSTOMER]).
- **Products:** (id, name, description, price, stock_id, material_info, image_alt_text, imageName, imageUrl).
- **Wishlists:** (id, userId, productId, createdAt) - Relacionamento N:N entre Users e Products.
- **Analytics:** (product_id, clicks, whatsapp_leads, views).

## 6.1. REGRA DE NEGÓCIO: EXIBIÇÃO DE IMAGENS
- **Armazenamento:** O banco de dados armazena **apenas o nome do arquivo** no campo `imageUrl` (ex: `tenis-runner-pro.webp`).
- **Composição de URL:** A URL final é composta dinamicamente no backend através de um prefixo de storage definido no Use Case (`/img/catalogo/`).
- **Transformação:** Os Use Cases `ListProductsUseCase` e `GetProductBySkuUseCase` aplicam a lógica de prefixo antes de retornar os dados da API.
- **Fallback:** Quando `imageUrl` é nulo/undefined, o frontend utiliza `/img/catalogo/produto-default.webp` como padrão.
- **Localização Física:** Imagens residem em `shop-varejo/public/img/catalogo/` e são servidas pelo Next.js na raiz `/img/catalogo/`.

## 7. ACCESSIBILITY COMPLIANCE (A11Y)
- Contraste mínimo de 7:1 (P&B Puro).
- Suporte total a leitores de tela e navegação por teclado.
- Uso obrigatório de unidades `rem` para escalabilidade de fonte.

## 8. SUCCESS METRICS (KPIs)
1. **Lead Conversion:** Cliques no botão WhatsApp vs Visitas únicas.
2. **A11Y Usage:** Monitoramento do uso das ferramentas de zoom.
3. **Uptime:** Estabilidade dos containers Docker via Self-Healing do Antigravity.

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-30*
