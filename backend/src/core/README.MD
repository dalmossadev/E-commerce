# Camada Core (Clean Architecture)

Esta é a camada central da aplicação (Domain + Application). Contém as regras de negócio puras e é totalmente independente de frameworks, bibliotecas ou bancos de dados.

## Estrutura:
- **domain/**: Entidades e objetos de valor (ex: Product, Order). Contêm lógica interna e validações de estado.
- **use-cases/**: Casos de uso da aplicação organizados por domínio:
  - `orders/`: Criação e gestão de pedidos
  - `procurement/`: Compras e fornecedores
  - `catalog/`: Gestão de produtos e variantes
- **dto/**: Data Transfer Objects (entrada e saída dos use cases)
- **interfaces/**: Contratos para repositórios e serviços externos
- **errors/**: Erros específicos do domínio
- **container/**: Configuração de injeção de dependências

## Regra de Ouro:
Nada aqui pode importar nada de `infrastructure` ou `adapters`. Esta camada deve ser testável sem a necessidade de um banco de dados ligado.