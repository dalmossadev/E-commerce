Compreendido, Dalmo. Consolidei todas as suas diretrizes, especialistas e regras de atuação em um único documento mestre. Este arquivo foi organizado para ser a "Bíblia" do seu projeto, cobrindo desde a fundação do banco de dados até o pixel final na tela.

Pode copiar o conteúdo abaixo para o seu arquivo oficial:

---

# **Sisters Lab — Fullstack Master Protocol (v1.6)**

**Diretriz Geral:** O sistema é um ecossistema único. O Backend provê a lógica robusta e escalável, enquanto o Frontend entrega uma experiência minimalista, industrial e de alta conversão[cite: 1, 2].

---

## **I. ARQUITETURA BACKEND (THE CORE)**

### **1. Missão e Princípios**
*   **Objetivo**: Sistemas robustos utilizando TypeScript, Node.js e Express[cite: 5].
*   **Clean Architecture**: Divisão estrita entre Domain, Application, Infrastructure e Presentation[cite: 2, 5].
*   **SOLID & Clean Code**: Código autoexplicativo, desacoplado e funções pequenas[cite: 5].

### **2. Camadas de Responsabilidade**
*   **Domain**: Entidades e interfaces. Encapsulamento total das regras de negócio[cite: 5].
*   **Application (Use Cases)**: Representam ações do sistema (ex: `CreateLead`). Independentes de frameworks e bancos de dados[cite: 5].
*   **adapters/http/controllers**: Recebem requisições e validam DTOs. **PROIBIDO** conter regras de negócio ou acessar o banco diretamente[cite: 2, 5].
*   **Infrastructure**: Implementações de Repositories (TypeORM), ORM e drivers externos[cite: 5].

### **3. Persistência e Regras Críticas**
*   **Integridade**: Toda ação de interesse (ex: clique no coração) deve resultar em persistência física imediata, mesmo para usuários não logados (Leads)[cite: 1, 5].
*   **Injeção de Dependência**: Uso obrigatório de factories ou containers; evitar a palavra-chave `new` dentro de classes de lógica[cite: 5].

---

## **II. ARQUITETURA FRONTEND (THE INTERFACE)**

### **4. Next.js & React Architecture**
*   **Componentização Atômica**: Divisão em átomos, moléculas e organismos para reuso[cite: 1].
*   **Hooks Customizados**: Toda lógica de API ou estado complexo deve estar em Hooks (ex: `useWishlist`)[cite: 4].
*   **Gestão de Mídia**: URLs de imagem são montadas dinamicamente: `process.env.NEXT_PUBLIC_IMAGE_URL` + `imageName`[cite: 1].

### **5. Design System (Identidade Sisters Lab)**
*   **Estética**: Minimalismo industrial rigoroso. **PROIBIDO** o uso de `border-radius` (bordas 100% quadradas)[cite: 1].
*   **Paleta de Cores**: Exclusivamente Preto (#000000), Branco (#FFFFFF) e Verde Neon (#00FF00)[cite: 1].
*   **Feedback**: Feedback visual imediato (Skeletons ou Spinners) para cada ação do usuário[cite: 1].

---

## **III. EQUIPE DE ESPECIALISTAS (ROLES & AGENTS)**

### **1. Engenharia Backend**
*   **Leonardo Backend (id: "backend-senior")**: Guardião do SOLID e Clean Architecture. Auditor de acoplamento entre camadas[cite: 1, 2, 4].
*   **Data Architect (id: "data-architect")**: Especialista em TypeORM e Migrations. Garante a persistência atômica entre Leads e Wishlists.
*   **QA Automation Engine (id: "qa-engine")**: Especialista em TDD. Exige gravação física no banco para validar Use Cases (No-Mock Policy)[cite: 5].

### **2. Experiência Frontend**
*   **UX Architect (id: "ux-architect")**: Focado em fluxos de conversão. Garante que o desejo do Lead (produto selecionado) não se perca no cadastro.
*   **UI Developer (id: "ui-developer")**: O designer de código. Garante o visual industrial e a ausência de bordas arredondadas[cite: 1].
*   **FE Integration Specialist (id: "fe-integration")**: Responsável por conectar Hooks às APIs e garantir o mapeamento de dados `{ data: [...] }`.

---

## **IV. REGRAS DE ATUAÇÃO E WORKFLOW**

### **6. Sincronia Fullstack**
*   **Contrato de Dados**: Alterações no Schema (DB) devem ser comunicadas imediatamente ao Frontend para evitar quebra de interface.
*   **Validação de Input**: Nunca confiar em input externo; validar tudo via DTOs (Zod/Class-validator)[cite: 5].

### **7. Testabilidade e Qualidade**
*   **TDD Obrigatório**: Testes unitários para Use Cases e integração para rotas e persistência real[cite: 5].
*   **Tratamento de Erros**: Uso de classes customizadas (`AppError`) e mensagens amigáveis no Frontend, sem vazar logs técnicos[cite: 5].

### **8. Protocolo de Commit**
*   **Commit sob Demanda**: **ESTRITAMENTE PROIBIDO** realizar `git commit` sem a autorização explícita do Dalmo após validação visual e técnica[cite: 1].

---

**Última Atualização:** 01/05/2026
**Status:** Versão 1.6 - Fullstack Integrada

---
