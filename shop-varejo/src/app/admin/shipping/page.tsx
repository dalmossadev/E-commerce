'use client';

import { useState } from 'react';
import { useShipping } from '@/hooks/useShipping';
import { 
  Truck, 
  MapPin, 
  Plus, 
  Save, 
  X, 
  Clock, 
  DollarSign, 
  Zap,
  Globe,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/constants/site-config';

export default function AdminShippingPage() {
  const { rules, loading, error, refetch, saveRule } = useShipping();
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    zipStart: '',
    zipEnd: '',
    price: 0,
    minAmountForFreeShipping: 0,
    estimatedDays: 1,
    active: true
  });

  const handleSave = async () => {
    try {
      await saveRule(newRule);
      setIsAdding(false);
      setNewRule({
        name: '',
        zipStart: '',
        zipEnd: '',
        price: 0,
        minAmountForFreeShipping: 0,
        estimatedDays: 1,
        active: true
      });
    } catch (err) {
      alert('Erro ao salvar regra');
    }
  };

  if (loading && rules.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Carregando Logística de CEPs...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Zonas de <span className="text-[#00FF00]">Entrega</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Configuração Dinâmica de CEP • Matriz de Custos
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
             onClick={() => setIsAdding(true)}
             className="flex items-center gap-2 px-4 py-2 bg-[#00FF00] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00DD00] transition-colors"
          >
            <Plus className="w-3 h-3" /> Nova Regra
          </button>
          <button 
            onClick={() => refetch()}
            className="p-2 border border-white/10 hover:bg-white/5 text-white/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* NEW RULE FORM */}
      {isAdding && (
        <div className="bg-black border border-[#00FF00] p-6 space-y-6 shadow-[0_0_30px_rgba(0,255,0,0.1)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00FF00]" /> Configurar Nova Regra de Frete
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-white/30 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Nome da Zona</label>
              <input 
                placeholder="EX: SÃO PAULO CAPITAL"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newRule.name}
                onChange={e => setNewRule({...newRule, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">CEP Inicial</label>
              <input 
                placeholder="00000000"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newRule.zipStart}
                onChange={e => setNewRule({...newRule, zipStart: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">CEP Final</label>
              <input 
                placeholder="99999999"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newRule.zipEnd}
                onChange={e => setNewRule({...newRule, zipEnd: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Custo de Frete (R$)</label>
              <input 
                type="number"
                placeholder="15.00"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newRule.price / 100}
                onChange={e => setNewRule({...newRule, price: Math.round(Number(e.target.value) * 100)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Frete Grátis acima de (R$)</label>
              <input 
                type="number"
                placeholder="200.00"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={(newRule.minAmountForFreeShipping || 0) / 100}
                onChange={e => setNewRule({...newRule, minAmountForFreeShipping: Math.round(Number(e.target.value) * 100)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Prazo Estimado (Dias)</label>
              <input 
                type="number"
                placeholder="3"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newRule.estimatedDays}
                onChange={e => setNewRule({...newRule, estimatedDays: Number(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[#00FF00] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00DD00] transition-colors"
            >
              <Save className="w-3 h-3" /> Salvar Regra
            </button>
          </div>
        </div>
      )}

      {/* RULES TABLE */}
      <div className="bg-black border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Zona / Nome</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-center">Faixa de CEP</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-center">Prazo</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Custo</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Gatilho Grátis</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-[#00FF00] shadow-[0_0_5px_#00FF00]' : 'bg-red-500'}`} />
                       <div className="font-bold text-white uppercase text-xs">{rule.name}</div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-[10px] font-mono text-white/40">
                      {rule.zipStart} <span className="text-[#00FF00]">→</span> {rule.zipEnd}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-white/60">
                      <Clock size={12} className="text-[#00FF00]" /> {rule.estimatedDays} d
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-white font-mono">{formatPrice(rule.price)}</div>
                  </td>
                  <td className="p-4 text-right">
                    {rule.minAmountForFreeShipping ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/30 text-[9px] font-bold uppercase">
                        <Zap size={10} /> {formatPrice(rule.minAmountForFreeShipping)}
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-white/20 uppercase">Sem gatilho</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-white/20 font-mono uppercase tracking-[0.3em]">
                    Nenhuma zona de entrega configurada no sistema
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#00FF00]/5 border border-[#00FF00]/20 p-4 flex items-start gap-3">
        <Globe size={18} className="text-[#00FF00] mt-0.5" />
        <div>
          <p className="text-[10px] font-mono text-[#00FF00] uppercase font-bold mb-1">Módulo Global de Logística</p>
          <p className="text-[10px] text-white/50 leading-relaxed max-w-3xl">
            As faixas de CEP devem seguir o padrão brasileiro (8 dígitos numéricos). O sistema prioriza a regra mais específica encontrada. 
            Regras com frete grátis sobrescrevem o custo base quando o valor do carrinho atinge o gatilho configurado.
          </p>
        </div>
      </div>
    </div>
  );
}
