'use client';

import { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Calendar,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FinancialReportPDF } from '@/components/reports/FinancialReportPDF';
import { formatPrice } from '@/constants/site-config';

export default function FinancialDashboardPage() {
  const { data, loading, error, refetch } = useFinancial();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Compilando Dados Financeiros...
        </div>
      </div>
    );
  }

  const chartData = data?.charts[activeTab] || [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Ledger <span className="text-[#00FF00]">Financeiro</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Fluxo de Caixa • Sistema de Auditoria v1.0
          </p>
        </div>
        <div className="flex items-center gap-6">
          {data && (
            <PDFDownloadLink
              document={<FinancialReportPDF data={data} />}
              fileName={`Relatorio_Financeiro_${new Date().toISOString().split('T')[0]}.pdf`}
              className="flex items-center gap-2 text-[10px] font-mono text-white/40 hover:text-[#00FF00] transition-colors uppercase tracking-widest"
            >
              {({ loading }) => (loading ? 'Gerando...' : 'Exportar PDF')}
            </PDFDownloadLink>
          )}
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 text-[10px] font-mono text-[#00FF00] hover:text-white transition-colors uppercase tracking-widest"
          >
            <RefreshCw className="w-3 h-3" /> Atualizar Ledger
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Profit */}
        <div className="bg-black border border-[#00FF00]/30 p-6 relative overflow-hidden group shadow-[0_0_20px_rgba(0,255,0,0.05)]">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <DollarSign size={48} className="text-[#00FF00]" />
          </div>
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Lucro Líquido</p>
          <h2 className="text-2xl font-bold text-white font-mono">{formatPrice(data?.currentBalance.net || 0)}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#00FF00]">
            <ArrowUpRight size={12} /> +12.5% <span className="text-white/30 font-normal">vs mês anterior</span>
          </div>
        </div>

        {/* Income */}
        <div className="bg-black border border-white/10 p-6 relative group hover:border-white/20 transition-colors">
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Receita Bruta</p>
          <h2 className="text-2xl font-bold text-white font-mono">{formatPrice(data?.currentBalance.income || 0)}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#00FF00]">
            <TrendingUp size={12} /> {chartData.length} Vendas Realizadas
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-black border border-white/10 p-6 relative group">
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Despesas / Custo</p>
          <h2 className="text-2xl font-bold text-white font-mono">{formatPrice(data?.currentBalance.expense || 0)}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-red-500">
            <TrendingDown size={12} /> -{formatPrice(data?.currentBalance.expense || 0)}
          </div>
        </div>

        {/* Fees */}
        <div className="bg-black border border-white/10 p-6 relative group">
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Taxas Operacionais</p>
          <h2 className="text-2xl font-bold text-white font-mono">{formatPrice(data?.currentBalance.fees || 0)}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-yellow-500">
            <CreditCard size={12} /> Gateway de Pagamento
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="bg-black border border-white/10">
        <header className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#00FF00]" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Análise de Performance</h3>
          </div>
          
          <div className="flex bg-white/5 p-1 border border-white/10">
            {[
              { id: 'daily', label: 'Dia' },
              { id: 'weekly', label: 'Semana' },
              { id: 'monthly', label: 'Mês' },
              { id: 'yearly', label: 'Ano' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-[#00FF00] text-black font-bold' 
                  : 'text-white/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-6 h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="period" 
                stroke="#444" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => {
                  if (activeTab === 'daily') return val.split('-').slice(2).join('/');
                  return val;
                }}
              />
              <YAxis 
                stroke="#444" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `R$${val/100000}k`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black border border-[#00FF00]/50 p-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
                        <p className="text-[10px] font-mono text-white/40 uppercase mb-2">{label}</p>
                        <p className="text-xs font-bold text-[#00FF00] uppercase tracking-wider">
                          Receita: {formatPrice(payload[0].value as number)}
                        </p>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider mt-1">
                          Despesa: {formatPrice(payload[1].value as number)}
                        </p>
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-[10px] font-mono text-white uppercase">
                            Net: {formatPrice((payload[0].value as number) - (payload[1].value as number))}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#00FF00" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#FF0000" 
                strokeWidth={1}
                strokeDasharray="5 5"
                fill="transparent"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-black border border-white/10">
        <header className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00FF00]" /> Lançamentos Recentes
          </h3>
          <button className="text-[10px] font-mono text-white/40 hover:text-[#00FF00] uppercase tracking-widest">
            Ver Todos
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Data / Hora</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Descrição</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Categoria</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-white/20 font-mono text-xs uppercase tracking-[0.2em]">
                    Sincronizando transações do servidor...
                  </td>
                </tr>
              ) : (
                data?.recentTransactions.map((t, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    {/* Map transactions here if available */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
