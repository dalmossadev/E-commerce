'use client';

import { useOrders } from '@/hooks/useOrders';
import { 
  Package, 
  Search, 
  Filter, 
  FileText, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/constants/site-config';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { OrderInvoicePDF } from '@/components/reports/OrderInvoicePDF';

const statusConfig = {
  PENDING: { label: 'Pendente', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
  PAID: { label: 'Pago', icon: CheckCircle2, color: 'text-[#00FF00]', bg: 'bg-[#00FF00]/10', border: 'border-[#00FF00]/50' },
  SHIPPED: { label: 'Enviado', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/50' },
  DELIVERED: { label: 'Entregue', icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/50' },
  CANCELLED: { label: 'Cancelado', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50' },
};

export default function AdminOrdersPage() {
  const { orders, loading, error, updateOrderStatus } = useOrders();

  if (loading && orders.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Carregando Logística...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Gestão de <span className="text-[#00FF00]">Pedidos</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Fluxo Logístico • Sprint 03
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              placeholder="BUSCAR PEDIDO O CLIENTE..."
              className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-xs font-mono text-white focus:border-[#00FF00] focus:outline-none transition-colors w-64 uppercase"
            />
          </div>
          <button className="p-2 border border-white/10 hover:bg-white/5 text-white/50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="bg-black border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">ID / Data</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">Cliente</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Total</th>
                <th className="p-4 text-[10px] font-mono text-white/50 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
                const StatusIcon = status.icon;

                return (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-white font-mono">#{order.id}</div>
                      <div className="text-[10px] text-white/30 font-mono">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white uppercase text-xs">{order.customerName}</div>
                      <div className="text-[10px] text-white/30 font-mono lowercase">{order.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <div className={`flex items-center gap-2 px-3 py-1 border ${status.border} ${status.bg} ${status.color} text-[9px] font-bold uppercase tracking-widest`}>
                          <StatusIcon className="w-3 h-3" /> {status.label}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-[#00FF00] font-mono">{formatPrice(order.total)}</div>
                      <div className="text-[9px] text-white/20 font-mono uppercase">{order.items?.length || 0} ITENS</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-white/40 hover:text-white transition-colors" title="Ver Detalhes">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <PDFDownloadLink
                          document={<OrderInvoicePDF order={order} />}
                          fileName={`Romaneio_Pedido_${order.id}.pdf`}
                          className="p-2 text-white/40 hover:text-[#00FF00] transition-colors"
                          title="Gerar Romaneio (PDF)"
                        >
                          {({ loading }) => (
                            loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />
                          )}
                        </PDFDownloadLink>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-white/20 font-mono uppercase tracking-[0.3em]">
                    Nenhum pedido processado no sistema
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
