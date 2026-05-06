'use client';

import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { 
  AlertTriangle, 
  Package, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Save,
  CheckCircle2,
  XCircle,
  Settings2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const LOW_STOCK_THRESHOLD = 5;

export default function AdminInventoryPage() {
  const { items, loading, error, refetch, updateStock } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const filteredItems = items.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditValue(item.stock);
  };

  const handleSave = async (id: number) => {
    try {
      await updateStock(id, editValue);
      setEditingId(null);
    } catch (err) {
      alert('Erro ao atualizar estoque');
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Sincronizando Inventário...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Gestão de <span className="text-[#00FF00]">Estoque</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Controle de SKUs • Auditoria em Tempo Real
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              placeholder="BUSCAR POR SKU OU NOME..."
              className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-xs font-mono text-white focus:border-[#00FF00] focus:outline-none transition-colors w-64 uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => refetch()}
            className="p-2 border border-white/10 hover:bg-white/5 text-white/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black border border-white/10 p-6 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase">Estoque Baixo</p>
            <h3 className="text-xl font-bold text-white font-mono">
              {items.filter(i => i.fulfillmentType === 'IN_STOCK' && i.stock <= LOW_STOCK_THRESHOLD).length} SKUs
            </h3>
          </div>
        </div>
        <div className="bg-black border border-white/10 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase">Total de Itens</p>
            <h3 className="text-xl font-bold text-white font-mono">
              {items.reduce((sum, i) => sum + i.stock, 0)} UN
            </h3>
          </div>
        </div>
        <div className="bg-black border border-[#00FF00]/20 p-6 flex items-center gap-4">
          <div className="p-3 bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20">
            <Settings2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase">Fulfillment Ativo</p>
            <h3 className="text-xl font-bold text-white font-mono">
              {items.filter(i => i.fulfillmentType === 'IN_STOCK').length} PRONTA-ENTREGA
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-black border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Produto / SKU</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Variante</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Fulfillment</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Qtd Disponível</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => {
                const isLow = item.fulfillmentType === 'IN_STOCK' && item.stock <= LOW_STOCK_THRESHOLD;
                const isOutOfStock = item.fulfillmentType === 'IN_STOCK' && item.stock === 0;

                return (
                  <tr key={item.id} className={`hover:bg-white/[0.02] transition-colors group ${isLow ? 'bg-red-500/[0.02]' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 overflow-hidden">
                           <img 
                              src={`/img/products/${item.product?.imageName || 'default.png'}`} 
                              className="w-full h-full object-cover"
                              alt={item.product?.name}
                           />
                        </div>
                        <div>
                          <div className="font-bold text-white uppercase text-xs truncate max-w-[200px]">
                            {item.product?.name}
                          </div>
                          <div className="text-[10px] text-white/30 font-mono">{item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="rounded-none text-[8px] font-mono border-white/20 text-white/50 uppercase">
                          {item.color}
                        </Badge>
                        <Badge variant="outline" className="rounded-none text-[8px] font-mono border-white/20 text-white/50 uppercase">
                          {item.size}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className={`text-[9px] font-mono ${item.fulfillmentType === 'IN_STOCK' ? 'text-blue-400' : 'text-purple-400'} uppercase`}>
                        {item.fulfillmentType.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {isOutOfStock ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/30 text-[9px] font-bold uppercase">
                            <XCircle size={10} /> ESGOTADO
                          </div>
                        ) : isLow ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-[9px] font-bold uppercase">
                            <AlertTriangle size={10} /> BAIXO ESTOQUE
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/30 text-[9px] font-bold uppercase">
                            <CheckCircle2 size={10} /> EM DIA
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {editingId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <input 
                            type="number" 
                            className="bg-white/10 border border-[#00FF00] w-20 text-right p-1 text-xs font-mono text-white outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className={`font-bold font-mono ${isLow ? 'text-red-500' : 'text-white'}`}>
                          {item.stock} UN
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                       {editingId === item.id ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleSave(item.id)}
                            className="p-1.5 bg-[#00FF00] text-black hover:bg-[#00DD00] transition-colors"
                          >
                            <Save size={14} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-white/10 text-white/50 hover:bg-white/20 transition-colors"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                       ) : (
                        <button 
                          onClick={() => handleStartEdit(item)}
                          className="text-[9px] font-mono text-white/30 hover:text-[#00FF00] transition-colors uppercase underline underline-offset-4"
                        >
                          AJUSTAR
                        </button>
                       )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
