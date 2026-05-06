'use client';

import { useState } from 'react';
import { couponService, Coupon } from '@/lib/api/services/couponService';
import { 
  Ticket, 
  Plus, 
  Save, 
  X, 
  Calendar, 
  Percent, 
  DollarSign, 
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/constants/site-config';
import { useEffect } from 'react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    type: 'PERCENTAGE',
    value: 0,
    minOrderAmount: 0,
    maxUses: 0,
    active: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const result = await couponService.list();
      setCoupons(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async () => {
    try {
      await couponService.save(newCoupon);
      setIsAdding(false);
      fetchCoupons();
      setNewCoupon({
        code: '',
        type: 'PERCENTAGE',
        value: 0,
        minOrderAmount: 0,
        maxUses: 0,
        active: true
      });
    } catch (err) {
      alert('Erro ao salvar cupom');
    }
  };

  if (loading && coupons.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Carregando Cupons...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Central de <span className="text-[#00FF00]">Cupons</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Marketing & Promoções • Regras de Desconto
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
             onClick={() => setIsAdding(true)}
             className="flex items-center gap-2 px-4 py-2 bg-[#00FF00] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00DD00] transition-colors"
          >
            <Plus className="w-3 h-3" /> Criar Cupom
          </button>
          <button 
            onClick={fetchCoupons}
            className="p-2 border border-white/10 hover:bg-white/5 text-white/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* NEW COUPON FORM */}
      {isAdding && (
        <div className="bg-black border border-[#00FF00] p-6 space-y-6 shadow-[0_0_30px_rgba(0,255,0,0.1)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#00FF00]" /> Configurar Nova Promoção
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-white/30 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Código do Cupom</label>
              <input 
                placeholder="EX: BEMVINDO10"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none uppercase"
                value={newCoupon.code}
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Tipo de Desconto</label>
              <select 
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newCoupon.type}
                onChange={e => setNewCoupon({...newCoupon, type: e.target.value as any})}
              >
                <option value="PERCENTAGE">PORCENTAGEM (%)</option>
                <option value="FIXED">VALOR FIXO (R$)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Valor do Desconto</label>
              <input 
                type="number"
                placeholder="10"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newCoupon.type === 'PERCENTAGE' ? newCoupon.value : (newCoupon.value || 0) / 100}
                onChange={e => setNewCoupon({
                  ...newCoupon, 
                  value: newCoupon.type === 'PERCENTAGE' ? Number(e.target.value) : Math.round(Number(e.target.value) * 100)
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Compra Mínima (R$)</label>
              <input 
                type="number"
                placeholder="100.00"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={(newCoupon.minOrderAmount || 0) / 100}
                onChange={e => setNewCoupon({...newCoupon, minOrderAmount: Math.round(Number(e.target.value) * 100)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Limite de Uso (Opcional)</label>
              <input 
                type="number"
                placeholder="0 = ILIMITADO"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                value={newCoupon.maxUses}
                onChange={e => setNewCoupon({...newCoupon, maxUses: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase">Data de Expiração</label>
              <input 
                type="date"
                className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono text-white focus:border-[#00FF00] outline-none"
                onChange={e => setNewCoupon({...newCoupon, expirationDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[#00FF00] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00DD00] transition-colors"
            >
              <Save className="w-3 h-3" /> Salvar Cupom
            </button>
          </div>
        </div>
      )}

      {/* COUPONS TABLE */}
      <div className="bg-black border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Código / Status</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Tipo</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-center">Valor</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-center">Uso</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Compra Mínima</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${coupon.active ? 'bg-[#00FF00]' : 'bg-red-500'}`} />
                       <div className="font-bold text-white uppercase text-xs tracking-widest">{coupon.code}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                      {coupon.type === 'PERCENTAGE' ? <Percent size={12} /> : <DollarSign size={12} />}
                      {coupon.type === 'PERCENTAGE' ? 'Porcentagem' : 'Valor Fixo'}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="font-bold text-white font-mono">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatPrice(coupon.value)}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-[10px] font-mono text-white/40">
                      {coupon.currentUses} <span className="text-white/20">/</span> {coupon.maxUses || '∞'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-[10px] font-mono text-white/60">
                      {coupon.minOrderAmount ? formatPrice(coupon.minOrderAmount) : 'R$ 0,00'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-white/20 font-mono uppercase tracking-[0.3em]">
                    Nenhum cupom ativo no sistema
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
