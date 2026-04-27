#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════
# deploy.sh — THE SISTERS' LAB · Implantação Completa
# ══════════════════════════════════════════════════════════════════════════
#
# USO:
#   chmod +x deploy.sh
#   ./deploy.sh              → Descompacta + configura ambiente local (dev)
#   ./deploy.sh --prod       → Descompacta + build de produção Docker
#   ./deploy.sh --only-front → Abre apenas os HTML de demonstração
#
# O QUE ESTE SCRIPT FAZ:
#   1. Verifica pré-requisitos (Node 20+, Docker, npm)
#   2. Descompacta sisters-lab-completo.zip
#   3. Configura .env.local com JWT_SECRET gerado automaticamente
#   4. Instala dependências (npm install)
#   5. Sobe o banco PostgreSQL via Docker Compose
#   6. Executa migrations (schema + seed com 8 produtos)
#   7. Verifica qualidade do código (typecheck + lint)
#   8. Inicia o servidor de desenvolvimento
#   9. Abre o browser automaticamente
#
# PRÉ-REQUISITOS:
#   - Node.js >= 20   → https://nodejs.org
#   - Docker Desktop  → https://docker.com
#   - unzip           → sudo apt install unzip  (Linux)
#                    → brew install unzip       (macOS)
# ══════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Cores ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

step()  { echo -e "\n${BLUE}${BOLD}[$(printf '%02d' $((++STEP)))]${NC} ${BOLD}$1${NC}"; }
ok()    { echo -e "     ${GREEN}✓${NC}  $1"; }
warn()  { echo -e "     ${YELLOW}⚠${NC}  $1"; }
err()   { echo -e "     ${RED}✗${NC}  $1"; }
info()  { echo -e "     ${CYAN}→${NC}  $1"; }
dim()   { echo -e "     ${DIM}$1${NC}"; }
STEP=0

# ── Flags ──────────────────────────────────────────────────────────────────
MODE="dev"
for arg in "$@"; do
  case $arg in
    --prod)       MODE="prod"       ;;
    --only-front) MODE="only-front" ;;
    --help|-h)
      echo "Uso: ./deploy.sh [--prod | --only-front]"
      exit 0 ;;
  esac
done

# ── Banner ──────────────────────────────────────────────────────────────────
clear
echo -e "${BOLD}"
cat << 'BANNER'
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║          ████████╗██╗  ██╗███████╗                                   ║
║             ██╔══╝██║  ██║██╔════╝                                   ║
║             ██║   ███████║█████╗                                     ║
║             ██║   ██╔══██║██╔══╝                                     ║
║             ██║   ██║  ██║███████╗                                   ║
║             ╚═╝   ╚═╝  ╚═╝╚══════╝                                   ║
║                                                                      ║
║         SISTERS' LAB — Deploy & Implantação Local                    ║
║         Next.js 14 · TypeORM · PostgreSQL · Docker                   ║
║         Salvador & Simões Filho, BA — Brasil                         ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
BANNER
echo -e "${NC}"
echo -e "  Modo: ${CYAN}${BOLD}${MODE^^}${NC}   Data: $(date '+%d/%m/%Y %H:%M')\n"

# ══════════════════════════════════════════════════════════════════════════
# MODO: SÓ FRONT-END
# ══════════════════════════════════════════════════════════════════════════
if [ "$MODE" = "only-front" ]; then
  step "Abrindo front-end standalone"
  FRONT_DIR="sisters-lab-frontend"

  # Descompacta HTML se ainda não estiver extraído
  if [ ! -d "$FRONT_DIR" ]; then
    mkdir -p "$FRONT_DIR"
    if [ -f "sisters-lab-completo.zip" ]; then
      unzip -j "sisters-lab-completo.zip" "*/frontend/*" -d "$FRONT_DIR" 2>/dev/null || true
    fi
    # Se não existir no zip, procura no diretório atual
    for f in sisters-lab.html sisters-lab-product.html sisters-lab-admin.html sisters-lab-integrated.html sisters-lab-a11y-report.html; do
      [ -f "$f" ] && cp "$f" "$FRONT_DIR/"
    done
  fi

  ok "Arquivos HTML disponíveis em ./${FRONT_DIR}/"
  echo ""
  echo -e "${BOLD}  Páginas disponíveis:${NC}"
  echo -e "  ${CYAN}→${NC}  sisters-lab.html           → Home + Vitrine + Checkout"
  echo -e "  ${CYAN}→${NC}  sisters-lab-product.html   → Página de Produto (Lupa HD + 360°)"
  echo -e "  ${CYAN}→${NC}  sisters-lab-admin.html     → Dashboard BI Admin"
  echo -e "  ${CYAN}→${NC}  sisters-lab-integrated.html → Vitrine conectada à API"
  echo -e "  ${CYAN}→${NC}  sisters-lab-a11y-report.html → Relatório A11Y 96/100"
  echo ""

  # Abre no browser (tenta múltiplos sistemas)
  MAIN_HTML="${FRONT_DIR}/sisters-lab.html"
  if [ -f "$MAIN_HTML" ]; then
    if command -v xdg-open &>/dev/null; then
      xdg-open "$MAIN_HTML"
    elif command -v open &>/dev/null; then
      open "$MAIN_HTML"
    else
      info "Abra manualmente: file://$(pwd)/${MAIN_HTML}"
    fi
  fi
  exit 0
fi

# ══════════════════════════════════════════════════════════════════════════
# PASSO 1 — Pré-requisitos
# ══════════════════════════════════════════════════════════════════════════
step "Verificando pré-requisitos"

ERRORS=0

# Node.js
if ! command -v node &>/dev/null; then
  err "Node.js não encontrado. Instale em https://nodejs.org (>= 20)"
  ERRORS=$((ERRORS+1))
else
  NODE_VER=$(node -v | sed 's/v//')
  NODE_MAJ=$(echo "$NODE_VER" | cut -d. -f1)
  if [ "$NODE_MAJ" -lt 20 ]; then
    err "Node.js ${NODE_VER} — versão mínima 20.0.0"
    ERRORS=$((ERRORS+1))
  else
    ok "Node.js v${NODE_VER}"
  fi
fi

# npm
if command -v npm &>/dev/null; then
  ok "npm v$(npm -v)"
else
  err "npm não encontrado"; ERRORS=$((ERRORS+1))
fi

# Docker
HAS_DOCKER=false
if command -v docker &>/dev/null; then
  if docker info &>/dev/null 2>&1; then
    ok "Docker v$(docker --version | awk '{print $3}' | tr -d ',')"
    HAS_DOCKER=true
  else
    warn "Docker instalado mas não está em execução. Inicie o Docker Desktop."
    HAS_DOCKER=false
  fi
else
  warn "Docker não encontrado — banco deve ser configurado manualmente"
fi

# Docker Compose
HAS_COMPOSE=false
COMPOSE_CMD=""
if $HAS_DOCKER; then
  if docker compose version &>/dev/null 2>&1; then
    HAS_COMPOSE=true; COMPOSE_CMD="docker compose"
    ok "Docker Compose $(docker compose version --short 2>/dev/null || echo 'v2')"
  elif command -v docker-compose &>/dev/null; then
    HAS_COMPOSE=true; COMPOSE_CMD="docker-compose"
    ok "docker-compose v$(docker-compose --version | awk '{print $3}' | tr -d ',')"
  fi
fi

# unzip
if ! command -v unzip &>/dev/null; then
  err "unzip não encontrado. sudo apt install unzip / brew install unzip"
  ERRORS=$((ERRORS+1))
else
  ok "unzip disponível"
fi

if [ $ERRORS -gt 0 ]; then
  echo -e "\n  ${RED}${BOLD}Corrija os erros acima antes de continuar.${NC}\n"
  exit 1
fi

# ══════════════════════════════════════════════════════════════════════════
# PASSO 2 — Localizar e descompactar o ZIP
# ══════════════════════════════════════════════════════════════════════════
step "Localizando e descompactando o projeto"

ZIP_FILE=""
for f in sisters-lab-completo.zip sisters-lab-*.zip; do
  [ -f "$f" ] && { ZIP_FILE="$f"; break; }
done

if [ -z "$ZIP_FILE" ]; then
  err "Nenhum arquivo sisters-lab-*.zip encontrado nesta pasta."
  info "Coloque o ZIP na mesma pasta que este script e execute novamente."
  exit 1
fi
ok "ZIP encontrado: ${ZIP_FILE}"

# Descompacta backend
BACKEND_DIR="sisters-lab"
if [ -d "$BACKEND_DIR" ]; then
  warn "Diretório '${BACKEND_DIR}' já existe."
  read -rp "  Sobrescrever? (s/N): " OVR
  if [[ "$OVR" =~ ^[sS]$ ]]; then
    rm -rf "$BACKEND_DIR"
    ok "Diretório anterior removido."
  else
    info "Mantendo diretório existente — pulando descompactação."
  fi
fi

if [ ! -d "$BACKEND_DIR" ]; then
  unzip -q "$ZIP_FILE" -d .
  ok "Projeto extraído em ./${BACKEND_DIR}/"
fi

# Descompacta front-end HTML (pasta separada)
FRONT_DIR="sisters-lab-frontend"
mkdir -p "$FRONT_DIR"
unzip -j "$ZIP_FILE" "*/frontend/*" -d "$FRONT_DIR" 2>/dev/null && ok "Front-end HTML em ./${FRONT_DIR}/" || true

cd "$BACKEND_DIR"
info "Diretório de trabalho: $(pwd)"

# ══════════════════════════════════════════════════════════════════════════
# PASSO 3 — Variáveis de ambiente
# ══════════════════════════════════════════════════════════════════════════
step "Configurando variáveis de ambiente"

ENV_FILE=".env.local"
[ "$MODE" = "prod" ] && ENV_FILE=".env.prod"

if [ ! -f "$ENV_FILE" ]; then
  cp .env.example "$ENV_FILE"
  ok "${ENV_FILE} criado a partir de .env.example"

  # Gera JWT_SECRET seguro automaticamente
  if command -v openssl &>/dev/null; then
    JWT=$(openssl rand -base64 64 | tr -d '\n=')
    sed -i.bak "s|troque_por_string_aleatoria_longa_e_segura|${JWT}|g" "$ENV_FILE"
    rm -f "${ENV_FILE}.bak"
    ok "JWT_SECRET gerado automaticamente"
  fi

  if [ "$MODE" = "prod" ]; then
    warn "Edite ${ENV_FILE} com suas credenciais de produção antes de continuar."
    echo ""
    read -rp "  Editar agora? (s/N): " ED
    [[ "$ED" =~ ^[sS]$ ]] && "${EDITOR:-nano}" "$ENV_FILE"
  fi
else
  ok "${ENV_FILE} já existe — mantido."
fi

# Carrega variáveis (silenciosamente)
set -a; source "$ENV_FILE" 2>/dev/null || true; set +a

# ══════════════════════════════════════════════════════════════════════════
# PASSO 4 — Dependências npm
# ══════════════════════════════════════════════════════════════════════════
step "Instalando dependências npm"
info "Isso pode levar alguns minutos na primeira vez..."

if [ "$MODE" = "prod" ]; then
  npm ci --omit=dev --silent
  ok "Dependências de produção instaladas (sem devDependencies)"
else
  npm install --silent
  ok "Dependências instaladas ($(ls node_modules 2>/dev/null | wc -l) pacotes)"
fi

# ══════════════════════════════════════════════════════════════════════════
# PASSO 5 — Banco de dados
# ══════════════════════════════════════════════════════════════════════════
step "Iniciando banco de dados PostgreSQL"

if $HAS_COMPOSE; then
  info "Subindo PostgreSQL via Docker Compose..."
  $COMPOSE_CMD up -d db

  info "Aguardando PostgreSQL ficar saudável..."
  ATTEMPTS=0
  until $COMPOSE_CMD exec -T db pg_isready -U postgres -d shop_varejo &>/dev/null 2>&1; do
    ATTEMPTS=$((ATTEMPTS+1))
    if [ $ATTEMPTS -ge 24 ]; then
      err "PostgreSQL não respondeu após 120s."; exit 1
    fi
    sleep 5; printf "."
  done
  echo ""
  ok "PostgreSQL saudável e pronto"
else
  warn "Docker não disponível. Configure DATABASE_HOST/PORT/NAME/USER/PASS no ${ENV_FILE}"
  warn "e certifique-se de que o PostgreSQL está rodando antes de continuar."
fi

# ══════════════════════════════════════════════════════════════════════════
# PASSO 6 — Migrations
# ══════════════════════════════════════════════════════════════════════════
step "Executando migrations TypeORM"

DB_PASS_VAL=$(grep '^DATABASE_PASSWORD=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'")
if [ -z "$DB_PASS_VAL" ] || echo "$DB_PASS_VAL" | grep -qi "troque\|change\|your"; then
  warn "DATABASE_PASSWORD não configurada — pulando migrations."
  info "Configure o .env e execute: npm run migration:run"
else
  if npm run migration:run 2>&1; then
    ok "Schema criado + seed executado (5 categorias + 8 produtos + admin)"
  else
    warn "Falha nas migrations. Verifique as credenciais em ${ENV_FILE}."
    info "Execute manualmente: npm run migration:run"
  fi
fi

# ══════════════════════════════════════════════════════════════════════════
# PASSO 7 — Quality gates (dev) / Build (prod)
# ══════════════════════════════════════════════════════════════════════════
step "Verificando qualidade do código"

TS_OK=true
LINT_OK=true

if npm run typecheck 2>&1 | tail -5; then
  ok "TypeScript: sem erros de tipo"
else
  warn "TypeScript: erros encontrados — npm run typecheck para detalhes"
  TS_OK=false
fi

if npm run lint 2>&1 | tail -5; then
  ok "ESLint: sem warnings críticos"
else
  warn "ESLint: avisos encontrados — npm run lint para detalhes"
  LINT_OK=false
fi

if [ "$MODE" = "prod" ]; then
  step "Build de produção Next.js"
  if npm run build; then
    ok "Build concluído — .next/standalone gerado"
  else
    err "Build falhou. Corrija os erros antes do deploy."; exit 1
  fi
fi

# ══════════════════════════════════════════════════════════════════════════
# PASSO 8 — Iniciar servidor (dev)
# ══════════════════════════════════════════════════════════════════════════
if [ "$MODE" = "dev" ]; then
  step "Iniciando servidor de desenvolvimento"
  info "Servidor iniciando em background..."

  # Inicia em background e aguarda ficar pronto
  npm run dev > /tmp/sisters-lab-dev.log 2>&1 &
  DEV_PID=$!

  ATTEMPTS=0
  info "Aguardando servidor ficar pronto..."
  until curl -sf http://localhost:3000/health > /dev/null 2>&1; do
    ATTEMPTS=$((ATTEMPTS+1))
    if [ $ATTEMPTS -ge 30 ]; then
      warn "Servidor demorou mais que o esperado. Verifique: tail /tmp/sisters-lab-dev.log"
      break
    fi
    sleep 2; printf "."
  done
  echo ""

  if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
    ok "Servidor rodando em http://localhost:3000"

    # Abre no browser
    if command -v xdg-open &>/dev/null; then xdg-open "http://localhost:3000"
    elif command -v open &>/dev/null;    then open    "http://localhost:3000"
    fi
  fi
fi

# ══════════════════════════════════════════════════════════════════════════
# RESUMO FINAL
# ══════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║           THE SISTERS' LAB — Implantação Concluída! 🎉           ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$MODE" = "dev" ]; then
  echo -e "${BOLD}  Aplicação (Next.js):${NC}"
  echo -e "  ${CYAN}→${NC}  http://localhost:3000              → Home"
  echo -e "  ${CYAN}→${NC}  http://localhost:3000/products     → Vitrine"
  echo -e "  ${CYAN}→${NC}  http://localhost:3000/checkout     → Checkout"
  echo -e "  ${CYAN}→${NC}  http://localhost:3000/health       → Health check"
  echo ""
  echo -e "${BOLD}  API Routes:${NC}"
  echo -e "  ${CYAN}→${NC}  GET  /api/products                 → Catálogo"
  echo -e "  ${CYAN}→${NC}  POST /api/orders                   → Criar pedido + link WA"
  echo -e "  ${CYAN}→${NC}  POST /api/analytics                → Rastrear eventos"
  echo -e "  ${CYAN}→${NC}  POST /api/auth/login               → Autenticação"
  echo ""
  echo -e "${BOLD}  Front-end HTML (sem servidor):${NC}"
  cd ..
  echo -e "  ${CYAN}→${NC}  ${FRONT_DIR}/sisters-lab.html"
  echo -e "  ${CYAN}→${NC}  ${FRONT_DIR}/sisters-lab-product.html"
  echo -e "  ${CYAN}→${NC}  ${FRONT_DIR}/sisters-lab-admin.html"
  echo ""
  echo -e "${BOLD}  Login admin:${NC}"
  echo -e "  ${CYAN}→${NC}  Email: admin@sisterslab.com"
  echo -e "  ${CYAN}→${NC}  Senha: admin123 ${YELLOW}← trocar antes do deploy!${NC}"
  cd "$BACKEND_DIR"

elif [ "$MODE" = "prod" ]; then
  echo -e "${BOLD}  Deploy de produção:${NC}"
  echo -e "  ${CYAN}→${NC}  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
  echo ""
  echo -e "${BOLD}  Checklist antes do deploy:${NC}"
  echo -e "  ${YELLOW}□${NC}  Configurar domínio + SSL (nginx ou Vercel)"
  echo -e "  ${YELLOW}□${NC}  WHATSAPP_NUMBER no .env.prod → número real"
  echo -e "  ${YELLOW}□${NC}  Alterar senha do admin (admin@sisterslab.com)"
  echo -e "  ${YELLOW}□${NC}  Configurar Supabase Storage para imagens"
  echo -e "  ${YELLOW}□${NC}  Habilitar GitHub Actions (push para main)"
fi

echo ""
echo -e "${BOLD}  Comandos úteis:${NC}"
echo -e "  ${DIM}npm run dev              → Servidor hot-reload${NC}"
echo -e "  ${DIM}npm run migration:run    → Executar migrations${NC}"
echo -e "  ${DIM}npm run typecheck        → Verificar tipos TypeScript${NC}"
echo -e "  ${DIM}docker-compose logs -f   → Acompanhar logs${NC}"
echo -e "  ${DIM}docker-compose down      → Parar containers${NC}"
echo ""

! $TS_OK   && echo -e "  ${YELLOW}⚠  Há erros de TypeScript. Execute: npm run typecheck${NC}"
! $LINT_OK && echo -e "  ${YELLOW}⚠  Há avisos de lint. Execute: npm run lint${NC}"

echo ""
