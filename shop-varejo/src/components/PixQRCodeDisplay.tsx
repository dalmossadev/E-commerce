import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface PixQRCodeDisplayProps {
  orderId: number;
  qrCodeBase64: string;
  qrCodePayload: string;
  total: number;
  onPaid: () => void;
}

export function PixQRCodeDisplay({ orderId, qrCodeBase64, qrCodePayload, total, onPaid }: PixQRCodeDisplayProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Polling every 10s
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const order = await response.json();
          if (order.status === 'PAID' || order.paymentStatus === 'PAID') {
            onPaid();
          }
        }
      } catch (error) {
        console.error('Polling error', error);
      }
    }, 10000);
    
    return () => clearInterval(pollInterval);
  }, [orderId, onPaid]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(qrCodePayload);
    if (success) {
      alert('Código PIX copiado!');
    } else {
      // Fallback
      try {
        const textArea = document.createElement("textarea");
        textArea.value = qrCodePayload;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        alert('Código PIX copiado!');
      } catch (e) {
        alert('Falha ao copiar automaticamente.');
      }
    }
  };

  const handleSimulatePayment = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/v1/dev/simulate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      
      if (response.ok) {
        alert('Pagamento simulado com sucesso (DEV)!');
        setTimeout(() => {
          onPaid();
        }, 2000);
      } else {
        alert(`Erro ao simular pagamento.`);
      }
    } catch (error) {
      console.error('Simulate payment error', error);
      alert(`Erro de conexão ao simular pagamento.`);
    }
  };

  const isDev = process.env.NEXT_PUBLIC_APP_ENV !== 'production';

  return (
    <div className="container-app py-20">
      <div className="max-w-md mx-auto bg-brand-surface border border-brand-border p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-green-500/10 text-green-500 p-3 rounded-none">
            <Check size={32} />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-text mb-2">
          Pedido #{orderId} Criado!
        </h1>
        <p className="text-brand-muted mb-8">
          Para finalizar, realize o pagamento via PIX abaixo.
        </p>

        <div className="bg-white p-4 inline-block mb-2 border-[1px] border-black">
          <img src={qrCodeBase64} alt="PIX QR Code" className="w-64 h-64" />
        </div>

        <div className="mb-6">
          <p className={`font-bold text-2xl mb-1 ${timeLeft < 300 ? 'text-red-600' : 'text-brand-primary'}`}>
            {formatTime(timeLeft)}
          </p>
          <p className="text-sm font-medium text-brand-text">Após o pagamento, aguarde a confirmação automática.</p>
        </div>

        <div className="space-y-4">
          <div className="text-left mb-4">
            <p className="text-sm font-mono text-brand-muted mb-1">Valor a pagar:</p>
            <p className="text-2xl font-bold text-brand-primary">
              R$ {(total / 100).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="mb-6 w-full text-left">
            <label className="block text-sm font-mono text-brand-muted mb-2">Código Copia e Cola:</label>
            <div className="flex w-full">
              <input
                type="text"
                readOnly
                value={qrCodePayload}
                className="w-full px-3 py-2 bg-brand-background border border-brand-border text-brand-text text-sm font-mono truncate focus:outline-none"
              />
              <Button
                variant="primary"
                className="ml-2 whitespace-nowrap bg-black text-white rounded-none"
                onClick={handleCopy}
              >
                Copiar
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={() => router.push('/orders')}
          >
            Ir para Meus Pedidos
          </Button>

          {isDev && (
            <button
              onClick={handleSimulatePayment}
              className="w-full mt-4 py-2 border-2 border-[#00FF00] text-[#00FF00] font-bold tracking-wider hover:bg-[#00FF00]/10 transition-colors"
            >
              Simular Confirmação PIX (DEV)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
