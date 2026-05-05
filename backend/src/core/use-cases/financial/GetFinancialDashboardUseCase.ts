import { IFinancialTransactionRepository } from '@core/interfaces/IFinancialTransactionRepository';

export interface FinancialDashboardResult {
  currentBalance: {
    income: number;
    expense: number;
    fees: number;
    net: number;
  };
  recentTransactions: any[];
}

export class GetFinancialDashboardUseCase {
  constructor(
    private financialRepository: IFinancialTransactionRepository
  ) {}

  async execute(): Promise<FinancialDashboardResult> {
    // Calculando saldo dos últimos 30 dias (ou de todo o tempo para MVP)
    // Para MVP vamos pegar de todo o tempo (podemos setar a data inicial para bem atrás)
    const startDate = new Date('2020-01-01');
    const endDate = new Date();
    
    const balance = await this.financialRepository.calculateBalanceByPeriod(startDate, endDate);
    
    // Podemos também retornar as últimas 10 transações
    // O TypeORMRepository ainda não tem um 'findRecent', mas podemos pegar via query ou todos
    // Como é MVP, vamos trazer todos e ordenar pelo JS por enquanto, ou apenas retornar o consolidado.
    // O IFinancialTransactionRepository atual não tem paginação de transações, 
    // mas pra dashboard inicial, o balance já atende a tríade.
    
    return {
      currentBalance: balance,
      recentTransactions: [] // placeholder para uma lista de transações se houver futuro
    };
  }
}
