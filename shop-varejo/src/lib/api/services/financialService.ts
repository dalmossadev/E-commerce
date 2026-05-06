import { API_BASE_URL } from '@/constants/site-config';

export interface FinancialDashboardData {
  currentBalance: {
    income: number;
    expense: number;
    fees: number;
    net: number;
  };
  charts: {
    daily: any[];
    weekly: any[];
    monthly: any[];
    yearly: any[];
  };
  recentTransactions: any[];
}

export const financialService = {
  async getDashboard(): Promise<FinancialDashboardData> {
    const response = await fetch(`${API_BASE_URL}/api/v1/financial/dashboard`);
    if (!response.ok) throw new Error('Falha ao buscar dados financeiros');
    return response.json();
  }
};
