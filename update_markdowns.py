import os

footer = "\n\n---\n**Autor: Dalmo Pereira**\n*Atualizado: 2026-04-27*\n"

files = [
    "./shop-varejo/MANUTENCAO.md",
    "./shop-varejo/README.md",
    "./constitution.md",
    "./backlog.md",
    "./diagnostico_projeto.md",
    "./RELATORIO.md",
    "./backend/PROJECT_REPORT.md",
    "./backend/docs/TDD.md",
    "./backend/docs/PRD_Sisters_Lab.md",
    "./backend/README.md",
    "./backend/src/infrastructure/database/README.md",
    "./backend/src/infrastructure/database/mappers/README.md",
    "./backend/ESTRUTURA.md",
    "./prd.md",
    "./README.md",
    "./.github/agents/backend-api-audit.agent.md"
]

for filepath in files:
    if not os.path.exists(filepath): continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    parts = content.split('\n---')
    if len(parts) > 1:
        last_part = parts[-1].strip()
        keywords = ['Autor:', 'Actualizado:', 'Atualizado:', 'Generated', 'Documento', 'Relatório', 'Manual', 'Maestro', 'Fim do', 'ASSINATURA']
        if len(last_part) < 300 and any(kw in last_part for kw in keywords):
            content = '\n---'.join(parts[:-1])
    
    content = content.rstrip() + footer
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("OK")
