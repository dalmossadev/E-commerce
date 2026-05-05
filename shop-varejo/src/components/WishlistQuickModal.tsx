'use client';

import { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createLeadAction } from '@/actions/lead.actions';

interface WishlistQuickModalProps {
  productName: string;
  sku: string;
  productId: number;
  variantId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialName?: string;
  initialEmail?: string;
}

export function WishlistQuickModal({
  productName,
  sku,
  productId,
  variantId,
  isOpen,
  onClose,
  onSuccess,
  initialName = '',
  initialEmail = '',
}: WishlistQuickModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resetar formulário quando o modal abre ou dados iniciais mudam
  useEffect(() => {
    if (isOpen) {
      setName(initialName || localStorage.getItem('lead_name') || '');
      setEmail(initialEmail || localStorage.getItem('lead_email') || '');
      setPhone(localStorage.getItem('lead_phone') || '');
      setError('');
    }
  }, [isOpen, initialName, initialEmail]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('sku', sku);
    formData.append('customerName', name);
    formData.append('customerPhone', phone);
    if (email) formData.append('customerEmail', email);
    formData.append('productId', String(productId));
    if (variantId) formData.append('variantId', String(variantId));

    const result = await createLeadAction(formData);

    setLoading(false);

    if (result.success) {
      // Salva no localStorage para automação futura
      localStorage.setItem('lead_name', name);
      localStorage.setItem('lead_phone', phone);
      if (email) localStorage.setItem('lead_email', email);

      onSuccess();
      // Limpa campos
      setName('');
      setPhone('');
      setEmail('');
    } else {
      setError(result.error || 'Erro ao salvar. Tente novamente.');
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar à lista de desejos"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden="true" />

       {/* Modal */}
       <div className="relative z-10 w-full max-w-md bg-brand-background border border-brand-border p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-brand-primary" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-brand-text">
              Adicionar à Lista de Desejos
            </h2>
          </div>
           <button
             onClick={onClose}
             className="p-1 hover:bg-brand-surface transition-colors"
             aria-label="Fechar modal"
           >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-brand-muted mb-4">
          Produto: <strong className="text-brand-text">{productName}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="wish-name" className="block text-xs font-mono text-brand-muted mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              id="wish-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
               className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-sm text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="Seu nome completo"
            />
          </div>

          {/* Telefone WhatsApp */}
          <div>
            <label htmlFor="wish-phone" className="block text-xs font-mono text-brand-muted mb-1">
              WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              id="wish-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
               className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-sm text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="(71) 99999-9999"
            />
          </div>

          {/* Email (opcional) */}
          <div>
            <label htmlFor="wish-email" className="block text-xs font-mono text-brand-muted mb-1">
              E-mail <span className="text-brand-muted/50">(opcional)</span>
            </label>
            <input
              id="wish-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-sm text-brand-text focus:border-brand-primary focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-xs text-red-500 font-mono">{error}</p>
          )}

          {/* Botão */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || !name || !phone}
            className="mt-2"
          >
            {loading ? 'Salvando...' : 'Salvar e adicionar à lista'}
          </Button>
        </form>

        <p className="text-[10px] text-brand-muted/50 font-mono mt-4 text-center">
          Não é necessário criar uma conta. Seus dados serão usados apenas para contato via WhatsApp.
        </p>
      </div>
    </div>
  );
}
