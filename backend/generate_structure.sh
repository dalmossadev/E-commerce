#!/bin/bash

# Nome do arquivo de saída
OUTPUT_FILE="ESTRUTURA.md"

echo "# Estrutura de Arquivos - Sisters Lab" > $OUTPUT_FILE
echo "Gerado em: $(date +'%d/%m/%Y %H:%M:%S')" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "## 1. Visão Geral (Árvore)" >> $OUTPUT_FILE
echo '```text' >> $OUTPUT_FILE

# O comando 'tree' é o melhor para isso. 
# -I ignora pastas irrelevantes.
# -L 4 limita a profundidade para manter o MD legível.
if command -v tree &> /dev/null
then
    tree -I 'node_modules|dist|.git|.DS_Store' -L 4 >> $OUTPUT_FILE
else
    # Fallback caso não tenha 'tree' instalado no servidor/máquina
    ls -R | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' -e 's/^/   /' >> $OUTPUT_FILE
fi

echo '```' >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "## 2. Detalhes dos Diretórios Principais" >> $OUTPUT_FILE
echo "| Diretório | Responsabilidade (Clean Arch) |" >> $OUTPUT_FILE
echo "|-----------|-------------------------------|" >> $OUTPUT_FILE
echo "| src/domain | Entidades de negócio e interfaces de repositórios |" >> $OUTPUT_FILE
echo "| src/application | Casos de Uso (Use Cases) e serviços da aplicação |" >> $OUTPUT_FILE
echo "| src/infrastructure | Implementações de BD (TypeORM), Subscribers e Repositórios |" >> $OUTPUT_FILE
echo "| src/presentation | Controllers, Rotas e Middlewares (Express) |" >> $OUTPUT_FILE
echo "| src/shared | Utilitários, Erros globais e DTOs comuns |" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
echo "Documento gerado automaticamente para auxílio na manutenção de arquitetura." >> $OUTPUT_FILE

echo "Varredura concluída! Verifique o arquivo $OUTPUT_FILE"