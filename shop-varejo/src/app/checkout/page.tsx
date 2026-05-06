'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext'; // SettingsContext.tsx — useSettings() exportado corretamente
import { Button } from '@/components/ui/Button';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { PixQRCodeDisplay } from '@/components/PixQRCodeDisplay';
import { shippingService, ShippingResult } from '@/lib/api/services/shippingService';
import { couponService, CouponValidationResult } from '@/lib/api/services/couponService';

type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
  { value: 'DEBIT_CARD', label: 'Cartão de Débito' },
  { value: 'PIX', label: 'PIX' },
  { value: 'BOLETO', label: 'Boleto' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { items, subtotal, totalItems, clearCart } = useCart();
  const settings = useSettings();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  
  // Novos Estados
  const [zipCode, setZipCode] = useState('');
  const [shippingData, setShippingData] = useState<ShippingResult | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState<CouponValidationResult | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState<{ qrCode: string; payload: string } | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  // Lógica de Frete
  const handleCalculateShipping = async () => {
    if (zipCode.length < 8) return;
    setIsCalculatingShipping(true);
    setError('');
    try {
      const result = await shippingService.calculate(zipCode, subtotal);
      setShippingData(result);
    } catch (err: any) {
      setError(err.message);
      setShippingData(null);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Lógica de Cupom
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setError('');
    try {
      const result = await couponService.validate(couponCode, subtotal);
      if (result.valid) {
        setCouponData(result);
      } else {
        setError(result.message || 'Cupom inválido');
        setCouponData(null);
      }
    } catch (err: any) {
      setError('Erro ao validar cupom');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePixPaid = () => {
    clearCart();
    router.push(`/orders?success=true&orderId=${createdOrderId}`);
  };

  if (isLoading) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-brand-muted">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0 && !pixData) {
    router.push('/');
    return null;
  }

  // DESCONTOS
  const progressiveDiscount = subtotal >= 500000 ? Math.floor(subtotal * 0.20) :
                               subtotal >= 200000 ? Math.floor(subtotal * 0.15) :
                               subtotal >= 100000 ? Math.floor(subtotal * 0.10) :
                               subtotal >= 50000 ? Math.floor(subtotal * 0.05) : 0;

  const couponDiscount = couponData?.discountAmount || 0;
  const shippingCost = shippingData?.price || 0;

  const total = subtotal - progressiveDiscount - couponDiscount + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // CORREÇÃO 2+5: Normalizar campos opcionais do CartItem para satisfazer o schema do backend
      // CartItem usa `price` como campo primário e `unitPrice` como alias opcional
      // CartItem usa `name` como campo primário e `productName` como alias opcional
      // variantId e fulfillmentType são opcionais no CartItem mas obrigatórios no backend
      const orderPayload = {
        customerId: user?.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: shippingAddress || undefined,
        items: items.map(item => ({
          variantId: Number(item.variantId ?? item.id),        // Garantir que é number
          sku: item.sku,
          productName: item.productName ?? item.name,          // fallback para name
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? item.price,             // fallback para price
          fulfillmentType: item.fulfillmentType ?? 'IN_STOCK', // fallback: enum FulfillmentType
        })),
        paymentMethod,
      };

      // Log diagnóstico — remover após validação
      console.log('[checkout] POST /api/orders payload:', JSON.stringify(orderPayload, null, 2));

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderResponse.json();
      console.log('[checkout] POST /api/orders response:', orderResponse.status, orderData);

      if (!orderResponse.ok) {
        if (orderData.status === 'validation_error' && orderData.errors) {
          const firstError = orderData.errors[0];
          throw new Error(`Erro: ${firstError.message}`);
        }
        throw new Error(orderData.message || orderData.error || 'Erro ao finalizar pedido');
      }

      setCreatedOrderId(orderData.id);

      if (paymentMethod === 'PIX') {
        if (orderData.qrCodePayload && orderData.qrCodeBase64) {
          setPixData({
            qrCode: orderData.qrCodeBase64,
            payload: orderData.qrCodePayload
          });
          // Do NOT clear cart yet. Let the polling do it on PAID.
          return;
        } else {
          // Fallback just in case backend didn't return it but it was generated
          setIsGeneratingPix(true);
          try {
            const pixResponse = await fetch(`/api/orders/${orderData.id}/pix`);
            const pixDataResponse = await pixResponse.json();
            
            if (pixResponse.ok && (pixDataResponse.qrCode || pixDataResponse.qrCodeBase64)) {
              setPixData({
                qrCode: pixDataResponse.qrCode || pixDataResponse.qrCodeBase64,
                payload: pixDataResponse.payload || ''
              });
              return;
            } else {
              throw new Error(pixDataResponse.error || 'Falha ao gerar QR Code do PIX');
            }
          } finally {
            setIsGeneratingPix(false);
          }
        }
      }

      clearCart();
      router.push(`/orders?success=true&orderId=${orderData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isGeneratingPix) {
    return (
      <div className="container-app py-20">
        <div className="max-w-md mx-auto bg-brand-surface border border-brand-border p-8 text-center">
          <div className="mb-6 flex justify-center">
             <div className="w-16 h-16 bg-[#F5F5F5] animate-pulse rounded-none" />
          </div>
          <div className="h-8 bg-[#F5F5F5] animate-pulse w-3/4 mx-auto mb-2" />
          <div className="h-4 bg-[#F5F5F5] animate-pulse w-full mx-auto mb-8" />
          
          <div className="bg-[#F5F5F5] p-4 inline-block mb-2 border-4 border-[#F5F5F5] animate-pulse">
            <div className="w-64 h-64 bg-[#E0E0E0]" />
          </div>
          
          <div className="space-y-4 mt-6">
             <div className="h-12 bg-[#F5F5F5] animate-pulse w-full" />
             <div className="h-12 bg-[#F5F5F5] animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (pixData && createdOrderId) {
    return (
      <PixQRCodeDisplay
        orderId={createdOrderId}
        qrCodeBase64={pixData.qrCode}
        qrCodePayload={pixData.payload}
        total={total}
        onPaid={handlePixPaid}
      />
    );
  }

  return (
    <div className="container-app py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-brand-text mb-8">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-brand-surface border border-brand-border p-6">
              <h2 className="font-display text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
                <span className="text-brand-primary">1</span>
                Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-mono text-brand-muted mb-1">
                    Nome Completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 bg-brand-background border border-brand-border text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-mono text-brand-muted mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-brand-background border border-brand-border text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-mono text-brand-muted mb-1">
                    Telefone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 bg-brand-background border border-brand-border text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-brand-surface border border-brand-border p-6">
              <h2 className="font-display text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
                <span className="text-brand-primary">2</span>
                Endereço de Entrega
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-mono text-brand-muted mb-1">
                      CEP *
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="zipCode"
                        type="text"
                        maxLength={8}
                        placeholder="00000000"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-4 py-2 bg-brand-background border border-brand-border text-brand-text focus:border-brand-primary focus:outline-none"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCalculateShipping}
                        disabled={zipCode.length < 8 || isCalculatingShipping}
                        className="text-[10px] uppercase font-mono"
                      >
                        {isCalculatingShipping ? '...' : 'Calcular'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-mono text-brand-muted mb-1">
                    Endereço Completo *
                  </label>
                  <textarea
                    id="address"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    placeholder="Rua, número, bairro, cidade - Estado"
                    className="w-full px-4 py-2 bg-brand-background border border-brand-border text-brand-text focus:border-brand-primary focus:outline-none resize-none"
                  />
                </div>

                {shippingData && (
                  <div className="p-3 bg-[#00FF00]/10 border border-[#00FF00]/30 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[#00FF00] uppercase font-bold">
                      {shippingData.ruleName} • Entrega em {shippingData.estimatedDays} dias
                    </span>
                    <span className="text-[10px] font-mono text-white font-bold">
                      {shippingData.price === 0 ? 'GRÁTIS' : `R$ ${(shippingData.price / 100).toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-brand-surface border border-brand-border p-6">
              <h2 className="font-display text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
                <span className="text-brand-primary">3</span>
                Forma de Pagamento
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-4 border text-left transition-colors ${
                      paymentMethod === method.value
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-brand-border text-brand-text hover:border-brand-muted'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              leftIcon={isSubmitting ? undefined : <CreditCard size={18} />}
            >
              {isSubmitting ? 'Processando...' : `Pagar R$ ${(total / 100).toFixed(2).replace('.', ',')}`}
            </Button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-brand-surface border border-brand-border p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Resumo
              </h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.sku} className="flex justify-between text-sm">
                    <span className="text-brand-muted">
                      {item.quantity}x {item.productName ?? item.name}
                      {item.color && ` (${item.color})`}
                    </span>
                    <span className="text-brand-text">
                      R$ {(((item.unitPrice ?? item.price) * item.quantity) / 100).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="text-brand-text">R$ {(subtotal / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                
                {progressiveDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">Desconto progressivo</span>
                    <span className="text-green-500">- R$ {(progressiveDiscount / 100).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                {couponData && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-primary font-bold">Cupom aplicado</span>
                    <span className="text-brand-primary font-bold">- R$ {(couponDiscount / 100).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Frete</span>
                  <span className="text-brand-text">
                    {shippingData ? (shippingCost === 0 ? 'GRÁTIS' : `R$ ${(shippingCost / 100).toFixed(2).replace('.', ',')}`) : '--'}
                  </span>
                </div>

                {/* CAMPO DE CUPOM */}
                <div className="pt-4 border-t border-white/5">
                   <div className="flex gap-2">
                      <input 
                        placeholder="CUPOM"
                        className="flex-1 bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-mono text-white focus:border-[#00FF00] outline-none uppercase"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode || isValidatingCoupon}
                        className="bg-white/10 px-3 py-1.5 text-[10px] font-mono text-white/50 hover:bg-white/20 transition-colors uppercase"
                      >
                        {isValidatingCoupon ? '...' : 'Aplicar'}
                      </button>
                   </div>
                </div>

                <div className="flex justify-between font-bold text-lg pt-4 border-t border-brand-border">
                  <span className="text-brand-text">Total</span>
                  <span className="text-brand-primary font-display tracking-tight">R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
