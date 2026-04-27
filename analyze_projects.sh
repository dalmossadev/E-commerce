#!/bin/bash

# ============================================================
# Sisters Lab — Project Analyzer
# Analisa backend + frontend e gera um relatório para os agentes
# Uso: bash analyze-projects.sh
# ============================================================

ROOT_DIR="$(pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/shop-varejo"
OUTPUT="$ROOT_DIR/project-analysis.md"

echo "# Sisters Lab — Project Analysis" > "$OUTPUT"
echo "_Gerado em: $(date)_" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ─────────────────────────────────────────────
# BACKEND
# ─────────────────────────────────────────────
echo "## BACKEND" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Estrutura de pastas" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$BACKEND_DIR" ]; then
  find "$BACKEND_DIR/src" -type f -name "*.ts" | sort | sed "s|$BACKEND_DIR/||" >> "$OUTPUT"
else
  echo "Pasta backend não encontrada em $BACKEND_DIR" >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Rotas registradas" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$BACKEND_DIR" ]; then
  grep -rh "router\.\|app\." "$BACKEND_DIR/src" --include="*.ts" \
    | grep -E "\.(get|post|put|patch|delete)\(" \
    | sed "s/^[[:space:]]*//" \
    | sort -u >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Endpoints de autenticação" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$BACKEND_DIR" ]; then
  grep -rh "auth\|login\|register\|refresh\|jwt\|token" \
    "$BACKEND_DIR/src" --include="*.ts" -l >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### DTOs exportados" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$BACKEND_DIR" ]; then
  find "$BACKEND_DIR/src/core/dto" -name "*.ts" 2>/dev/null | sort >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Entidades de domínio" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$BACKEND_DIR" ]; then
  find "$BACKEND_DIR/src/core/domain" -name "*.ts" 2>/dev/null | sort >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### package.json (backend)" >> "$OUTPUT"
echo '```json' >> "$OUTPUT"
if [ -f "$BACKEND_DIR/package.json" ]; then
  cat "$BACKEND_DIR/package.json" >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Variáveis de ambiente esperadas (.env.example)" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
for f in "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env.sample" "$BACKEND_DIR/.env"; do
  if [ -f "$f" ]; then
    cat "$f" >> "$OUTPUT"
    break
  fi
done
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ─────────────────────────────────────────────
# FRONTEND
# ─────────────────────────────────────────────
echo "## FRONTEND (shop-varejo)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Estrutura de pastas" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$FRONTEND_DIR" ]; then
  find "$FRONTEND_DIR/src" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null \
    | sort | sed "s|$FRONTEND_DIR/||" >> "$OUTPUT"
  find "$FRONTEND_DIR/app" -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null \
    | sort | sed "s|$FRONTEND_DIR/||" >> "$OUTPUT"
else
  echo "Pasta shop-varejo não encontrada em $FRONTEND_DIR" >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Chamadas de API existentes (fetch/axios)" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$FRONTEND_DIR" ]; then
  grep -rh "fetch(\|axios\.\|api\.\|baseURL\|NEXT_PUBLIC_API" \
    "$FRONTEND_DIR" --include="*.ts" --include="*.tsx" \
    | grep -v "node_modules" \
    | sed "s/^[[:space:]]*//" \
    | sort -u >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Variáveis de ambiente do frontend" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
for f in "$FRONTEND_DIR/.env.local" "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"; do
  if [ -f "$f" ]; then
    cat "$f" >> "$OUTPUT"
    break
  fi
done
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Páginas / rotas Next.js" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
if [ -d "$FRONTEND_DIR" ]; then
  find "$FRONTEND_DIR" -name "page.tsx" -o -name "page.ts" 2>/dev/null \
    | grep -v node_modules \
    | sed "s|$FRONTEND_DIR/||" \
    | sort >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### package.json (frontend)" >> "$OUTPUT"
echo '```json' >> "$OUTPUT"
if [ -f "$FRONTEND_DIR/package.json" ]; then
  cat "$FRONTEND_DIR/package.json" >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ─────────────────────────────────────────────
# GAP ANALYSIS
# ─────────────────────────────────────────────
echo "## GAP ANALYSIS" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Rotas backend sem consumo no frontend" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
BACKEND_ROUTES=""
if [ -d "$BACKEND_DIR" ]; then
  BACKEND_ROUTES=$(grep -rh "router\.\|app\." "$BACKEND_DIR/src" --include="*.ts" \
    | grep -oE "'/api/v1/[^'\"]*'" | sort -u)
  echo "$BACKEND_ROUTES" >> "$OUTPUT"
fi
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "### Resumo" >> "$OUTPUT"
echo "" >> "$OUTPUT"

BACKEND_FILES=0
FRONTEND_FILES=0
[ -d "$BACKEND_DIR/src" ] && BACKEND_FILES=$(find "$BACKEND_DIR/src" -name "*.ts" | wc -l)
[ -d "$FRONTEND_DIR" ] && FRONTEND_FILES=$(find "$FRONTEND_DIR" \( -name "*.ts" -o -name "*.tsx" \) \
  | grep -v node_modules | wc -l)

echo "| Item | Valor |" >> "$OUTPUT"
echo "|------|-------|" >> "$OUTPUT"
echo "| Arquivos TypeScript backend | $BACKEND_FILES |" >> "$OUTPUT"
echo "| Arquivos TypeScript/TSX frontend | $FRONTEND_FILES |" >> "$OUTPUT"
echo "| Backend URL esperada | http://localhost:3000 |" >> "$OUTPUT"
echo "| Frontend URL esperada | http://localhost:3001 |" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "✅ Análise concluída: $OUTPUT"
echo ""
echo "Próximo passo: abra o project-analysis.md e cole no OpenCode antes de rodar os agentes."