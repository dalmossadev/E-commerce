'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
  id: number;
  variantId: number;
  sku: string;
  productName: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fulfillmentType: string;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  items: OrderItem[];
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Pendente', color: 'text-yellow-500 bg-yellow-500/10', icon: <Clock size={16} /> },
  PAID: { label: 'Pago', color: 'text-blue-500 bg-blue-500/10', icon: <CheckCircle size={16} /> },
  SHIPPED: { label: 'Enviado', color: 'text-purple-500 bg-purple-500/10', icon: <Truck size={16} /> },
  DELIVERED: { label: 'Entregue', color: 'text-green-500 bg-green-500/10', icon: <Package size={16} /> },
  CANCELLED: { label: 'Cancelado', color: 'text-red-500 bg-red-500/10', icon: <XCircle size={16} /> },
};

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  BOLETO: 'Boleto',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        setSuccessMessage(`Pedido #${params.get('orderId')} criado com sucesso!`);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, isLoading, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?redirect=/orders');
          return;
        }
        throw new Error('Falha ao buscar pedidos');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleConfirmPayment = async (orderId: number) => {
    if (!confirm('Deseja realmente confirmar o pagamento deste pedido?')) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}/confirm-payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Erro ao confirmar pagamento');
      }
      
      setSuccessMessage(`Pagamento do pedido #${orderId} confirmado com sucesso!`);
      fetchOrders();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao confirmar pagamento');
    }
  };

  if (isLoading || isLoadingOrders) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-brand-muted">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Voltar
          </Button>
          <h1 className="font-display text-3xl font-bold text-brand-text">
            Meus Pedidos
          </h1>
        </div>

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 mb-6">
            {successMessage}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-brand-surface border border-brand-border">
            <Package size={48} className="mx-auto text-brand-muted mb-4" />
            <p className="text-brand-muted text-lg mb-4">Você ainda não tem pedidos</p>
            <Button
              variant="primary"
              onClick={() => router.push('/')}
            >
              Ver Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const statusConfig = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className="bg-brand-surface border border-brand-border p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-brand-primary text-sm mb-1">
                        Pedido #{order.id}
                      </p>
                      <p className="text-brand-muted text-sm">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-mono ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                      {order.paymentMethod && (
                        <span className="text-xs text-brand-muted">
                          {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-brand-border pt-4">
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-brand-text text-sm font-medium">
                              {item.productName}
                            </p>
                            <p className="text-brand-muted text-xs">
                              SKU: {item.sku}
                              {item.color && ` | Cor: ${item.color}`}
                              {item.size && ` | Tam: ${item.size}`}
                              {` | Qtd: ${item.quantity}`}
                            </p>
                          </div>
                          <p className="text-brand-text text-sm font-mono">
                            R$ {(item.totalPrice / 100).toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-brand-border pt-4 flex flex-col sm:flex-row justify-between gap-2">
                    <div className="text-sm text-brand-muted">
                      {order.discount > 0 && (
                        <span className="text-green-500">
                          Desconto: -R$ {(order.discount / 100).toFixed(2).replace('.', ',')}
                          {' | '}
                        </span>
                      )}
                      <span>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {user?.role?.toUpperCase() === 'ADMIN' && order.status === 'PENDING' && order.paymentMethod === 'PIX' && (
                        <Button size="sm" variant="outline" onClick={() => handleConfirmPayment(order.id)}>
                          Confirmar Pagamento
                        </Button>
                      )}
                      <p className="text-lg font-bold text-brand-primary">
                        Total: R$ {(order.total / 100).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
