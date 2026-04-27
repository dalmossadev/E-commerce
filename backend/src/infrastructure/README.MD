# Camada Infrastructure

Esta camada lida com as preocupações de baixo nível e ferramentas externas. Ela implementa as interfaces definidas no Core.

## Estrutura:
- **database/**: Configurações do TypeORM, entidades, mappers, repositórios
  - `data-source.ts`: Configuração da conexão com MySQL
  - `models/`: Entidades TypeORM com decoradores
  - `mappers/`: EntitySchema para mapeamento sem decoradores
  - `repositories/`: Implementações dos repositórios
  - `subscribers/`: Event listeners do TypeORM
- **logger/**: Configuração do Winston para logs estruturados
- **swagger/**: Configuração do Swagger/OpenAPI
- **upload/**: Configuração de upload de arquivos com Multer

## Regra de Ouro:
Esta camada é a "periferia" do sistema. Se decidirmos trocar o MySQL pelo PostgreSQL, as mudanças devem se limitar a este diretório.