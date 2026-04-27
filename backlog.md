# 📋 PROJECT BACKLOG: SHOP-VAREJO P&B (Full Edition v1.1)
**Framework:** Antigravity (Autonomous & Self-Healing)
**Status:** Sprint 01 Completed | Sprint 02 Ready

---

## 🏗️ SPRINT 01: CORE INFRA & A11Y FOUNDATION
*Objetivo: Estabelecer o ambiente Docker e a base de acessibilidade radical.*

### [TASK-01] Dockerization & Environment (Agent: DevOps)
- [x] Criar `Dockerfile` multi-stage (Node 20+ / Alpine) focado em performance.
- [x] Configurar `docker-compose.yml` com serviços: `app` (Next.js) e `db` (Postgres local).
- [x] Mapear volumes para persistência de dados e logs de erro (para Self-Healing).
- **Critério de Aceite:** Comando `docker-compose up` resulta em containers "Healthy".

### [TASK-02] Design System & A11Y Context (Agent: Front-end Dev + UX Auditor)
- [x] Configurar Tailwind CSS com `colors: { black: '#000', white: '#FFF' }`.
- [x] Implementar `A11yProvider` para gerenciar multiplicador de fonte (rem).
- [x] Criar componentes base (Button, Card, Input) estritamente em P&B.
- [x] **Auditoria:** UX Auditor valida contraste 7:1 e unidades rem.
- **Critério de Aceite:** Alteração no Provider atualiza layout proporcionalmente sem quebras.

---

## 🛒 SPRINT 02: DATA ENGINE & CATALOG
### [TASK-03] Database Modeling & TypeORM (Agent: Data Engineer + Architect)
- [x] **Spec:** Architect define o contrato TS para as Entidades.
- [x] Criar Entidades: `User`, `Product`, `Category` (TypeORM).
- [x] Campo `image_alt_text` configurado como `nullable: false`.
- **Critério de Aceite:** Migrations executadas com sucesso no banco Postgres local.

### [TASK-04] Product Magnifier & Visual Aid (Agent: Front-end Dev + Fullstack Dev)
- [ ] **Front-end:** Criar componente `ProductImage` com Lupa (Zoom) HD.
- [ ] **Fullstack:** Implementar lógica de "Pronta Entrega" via API (Salvador/Simões Filho).
- [ ] Garantir navegação do Zoom via teclado (Tab-index).
- **Critério de Aceite:** Zoom funcional em mobile e desktop com suporte A11Y.

---

## 📲 SPRINT 03: CONVERSION & DEPLOY
### [TASK-05] WhatsApp Sales Flow (Agent: Front-end Dev + Fullstack Dev)
- [ ] **Front-end:** Desenvolver interface do botão WhatsApp conforme P&B.
- [ ] **Fullstack:** Gerar link dinâmico com ID do produto e rastreio de cliques.
- **Critério de Aceite:** O clique abre o WhatsApp com a mensagem pré-configurada correta.

### [TASK-06] Final Audit & Production Build (Agent: DevOps + UX Auditor)
- [ ] Build de produção via Docker.
- [ ] Auditoria final de Acessibilidade (Nota > 90).

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
