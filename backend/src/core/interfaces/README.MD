# Interfaces e DTOs (Core)

Define os "contratos" de como os dados devem transitar entre as camadas do sistema.

## Conteúdo:
- **DTOs (Data Transfer Objects)**: Interfaces que definem o formato dos dados de entrada (Request) e saída (Response) dos use cases.
- **Repository Interfaces**: Contratos que obrigam a camada de `infrastructure` a implementar métodos específicos para o `core`.
- **Service Interfaces**: Contratos para serviços externos (ex: notificações, pagamentos).

## Exemplos:
- `IProductRepository`: Define métodos para persistência de produtos
- `ICustomerRepository`: Define métodos para gestão de clientes
- `IOrderRepository`: Define métodos para pedidos