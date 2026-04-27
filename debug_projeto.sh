#!/bin/bash
# Script de Diagnóstico de Projeto Backend - Dalmo ADS

ARQUIVO_LOG="diagnostico_projeto.md"

{
  echo "# 🔍 Diagnóstico do Projeto: $(basename "$PWD")"
  echo "Data: $(date '+%d/%m/%Y %H:%M:%S')"
  echo "---"

  echo "## 📂 1. Estrutura de Pastas (Hierarquia)"
  echo '```'
  # Lista pastas e arquivos principais, ignorando node_modules por motivos óbvios
  tree -L 3 -I 'node_modules|dist|.git'
  echo '```'

  echo "## 📄 2. Verificação de Arquivos Críticos"
  files=(".env" "package.json" "tsconfig.json" "ormconfig.json" "src/server.ts" "src/database/index.ts")
  for f in "${files[@]}"; do
    if [ -f "$f" ]; then
      echo "- [OK] Arquivo encontrado: $f"
    else
      echo "- [❌] ARQUIVO FALTANTE: $f"
    fi
  done

  echo -e "\n## 📦 3. Dependências (package.json)"
  if [ -f "package.json" ]; then
    echo '```json'
    grep -E "dependencies|devDependencies" -A 20 package.json
    echo '```'
  fi

  echo "## 🗄️ 4. Status do MySQL (Serviço Nativo)"
  if systemctl is-active --quiet mysql; then
    echo "- [OK] MySQL está em execução."
  else
    echo "- [❌] MySQL está PARADO ou não instalado."
  fi

  echo "## ⚙️ 5. Variáveis de Ambiente (Sem exibir senhas)"
  if [ -f ".env" ]; then
    echo '```'
    grep -v "PASSWORD" .env | grep -v "PASS"
    echo '```'
  else
    echo "- [❌] Arquivo .env não encontrado!"
  fi

  echo "---"
  echo "Fim do Diagnóstico."
} > "$ARQUIVO_LOG"

echo "Análise concluída! Verifique o arquivo: $ARQUIVO_LOG"
