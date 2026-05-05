'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface FinancialBalance {
  income: number;
  expense: number;
  fees: number;
  net: number;
}

export default function FinancialDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  const [balance, setBalance] = useState<FinancialBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/admin/financial/dashboard');
        if (!response.ok) {
          throw new Error('Falha ao carregar dados financeiros');
        }
        const data = await response.json();
        setBalance(data.currentBalance);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchDashboard();
    }
  }, [user]);

  const formatCurrency = (centavos: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(centavos / 100);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="animate-pulse text-[#00FF00] font-mono">Processando Ledger...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="border border-red-500 p-4 text-red-500 font-mono">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="mb-12 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-2">Ledger Contábil</h1>
        <p className="text-gray-400 text-sm tracking-widest">Painel de Controle Financeiro • MVP</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Receita Bruta */}
        <div className="border border-gray-800 p-6 flex flex-col justify-between hover:border-gray-600 transition-colors">
          <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Receita Bruta</h2>
          <p className="text-3xl font-mono text-white">
            {balance ? formatCurrency(balance.income) : 'R$ 0,00'}
          </p>
        </div>

        {/* Despesas */}
        <div className="border border-gray-800 p-6 flex flex-col justify-between hover:border-gray-600 transition-colors">
          <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Despesas (Fornecedores)</h2>
          <p className="text-3xl font-mono text-white">
            {balance ? formatCurrency(balance.expense) : 'R$ 0,00'}
          </p>
        </div>

        {/* Taxas Gateway */}
        <div className="border border-gray-800 p-6 flex flex-col justify-between hover:border-red-900 transition-colors">
          <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Taxas InfinitePay</h2>
          <p className="text-3xl font-mono text-red-500">
            {balance ? `-${formatCurrency(balance.fees)}` : 'R$ 0,00'}
          </p>
        </div>

        {/* Lucro Líquido */}
        <div className="border border-[#00FF00] p-6 flex flex-col justify-between shadow-[0_0_15px_rgba(0,255,0,0.1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#00FF00] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <h2 className="text-[#00FF00] text-xs uppercase tracking-widest mb-4 relative z-10">Lucro Líquido Real</h2>
          <p className="text-4xl font-mono text-[#00FF00] font-bold relative z-10">
            {balance ? formatCurrency(balance.net) : 'R$ 0,00'}
          </p>
        </div>

      </div>

      <section className="border border-gray-800 p-6">
        <h3 className="text-xl font-bold uppercase tracking-widest mb-6">Transações Recentes</h3>
        <div className="text-gray-400 font-mono text-sm text-center py-12">
          [Módulo de Extrato Detalhado programado para próxima fase da Sprint 03]
        </div>
      </section>

    </div>
  );
}
