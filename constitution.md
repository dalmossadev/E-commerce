# 📜 PROJECT CONSTITUTION: SHOP-VAREJO P&B (v1.1)
**Framework de Orquestração:** Antigravity (Autonomous & Self-Healing)
**Localização de Negócio:** Salvador & Simões Filho, BA - Brasil

---

## 🎯 1. VISÃO DO PRODUTO (CORE GOAL)
Desenvolver um e-commerce de calçados premium com estoque zero (cross-docking), focado em conversão via WhatsApp e acessibilidade radical. O sistema deve ser leve, rápido e operar em containers Docker.

## 🎨 2. IDENTIDADE VISUAL & UI (STRICT B&W)
- **Paleta de Cores:** Estritamente Monocromática (Pure Black #000, Pure White #FFF).
- **Proibição:** É proibido o uso de cores (vermelho, verde, azul) para status ou erro. Utilize ícones, bordas e labels textuais para feedback visual.
- **Tipografia:** Focada em legibilidade. Uso obrigatório de unidades relativas `rem` em todo o CSS/Tailwind.

## ♿ 3. PILARES DE ACESSIBILIDADE (A11Y)
- **Contrast Ratio:** Mínimo de 7:1 em todos os elementos.
- **Font Scaling:** Implementar botões globais de ajuste de fonte (A+/A-) que alteram o `html { font-size }`.
- **Visual Aid:** Implementar componente de Lupa (Magnifier) de alta definição em todas as fotos de produtos.
- **Semântica:** Uso rigoroso de HTML Semântico e atributos ARIA (Accessible Rich Internet Applications).
- **Navegação:** Suporte total a navegação por teclado (Tab-index lógico).

## 🛠️ 4. STACK TÉCNICA E ARQUITETURA
- **Frontend:** Next.js (App Router) + TypeScript.
- **Estilização:** Tailwind CSS.
- **Backend/ORM:** Node.js + TypeORM (Padrão MVC).
- **Database:** PostgreSQL (via Supabase).
- **Infraestrutura:** Docker & Docker Compose (Ambiente de Dev e Prod).

## 🐳 5. DIRETRIZES DE DEVOPS (SELF-HEALING)
- **Containerization:** Todo o ecossistema deve rodar em Docker.
- **Persistence:** Volumes configurados para PostgreSQL e logs.
- **CI/CD Ready:** O código deve passar em linting e type-check antes de qualquer tentativa de build.

## 🤖 6. PROTOCOLOS ANTIGRAVITY (AI AGENTS)
- **Autonomia:** Agentes são orientados a objetivos (Goals). Se um objetivo falhar, o agente deve tentar auto-correção (Self-Healing) analisando logs antes de solicitar intervenção humana.
- **Hierarquia de Agentes:**
    1. **Product Owner:** Gestor de estratégia, dono do PRD e do backlog.md. 
    2. **Architect Agent:** Define contratos de API e revisa a estrutura MVC e vvalida o SDD.       
    3. **DevOps Agent:** Gerencia Dockerfiles, docker-compose.yml e saúde dos containers (Self-healing infra).
    4. **Data Engineer:** Especialista em PostgreSQL e TypeORM; gerencia Entidades e Migrations.
    5. **Fullstack Agent:** Foca no "Middle-end" (Controllers, Integração de APIs e lógica de negócio).
    6. **Front-end Agent:** Foca no "Client-side" (Componentes React, Tailwind P&B, estados de UI e Lupa).
    7. **UX Auditor:** Guardião da acessibilidade; bloqueia código que não atinja contraste 7:1 ou tags ALT.
    8. **Logi-Salvador:** Especialista regional; valida regras de frete e cross-docking para Salvador e Simões Filho.
    9. **BI Analyst:** Especialista em transformar orders em KPIs. Domina Recharts e Agregações Complexas. Sua missão é provar visualmente se o frete de 4h (Salvador) converte mais que o de 12h (Simões Filho). Design estritamente Monocromático.

## 📄 7. ESPECIFICAÇÕES DE CÓDIGO (SDD)
- **Spec-Driven:** Antes de codar uma funcionalidade, o Agente Arquiteto deve gerar um contrato (JSON/Interface TS) para validação.
- **Clean Code:** Nomes de funções e variáveis em inglês. Comentários em português (opcional) apenas para lógica complexa.

---
**Autor: Dalmo Pereira**
*Atualizado: 2026-04-27*
