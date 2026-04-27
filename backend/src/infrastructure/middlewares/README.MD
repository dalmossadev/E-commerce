# Middlewares (Adapters HTTP)

Contém funções que são executadas entre o recebimento da requisição e a chegada ao Controller.

## Middlewares Disponíveis:
- **Auth Middleware**: Verifica tokens JWT (`auth.middleware.ts`)
- **Rate Limit**: Limitação de requisições (`RateLimitMiddleware.ts`)
- **Request Logger**: Log estruturado das requisições (`LogMiddleware.ts`)
- **Error Handler**: Captura exceções e retorna resposta padronizada (`ErrorHandler.ts`)
- **Validation**: Validação de esquemas de entrada (`validations/`)

## Localização:
- Middlewares HTTP: `src/adapters/http/middlewares/`
- Validações: `src/adapters/http/validations/`