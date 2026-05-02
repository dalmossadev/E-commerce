'use client';

import { useState } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createLeadAction } from '@/actions/lead.actions';

interface LeadInterestModalProps {
  sku: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadInterestModal({ sku, productName, isOpen, onClose }: LeadInterestModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    const result = await createLeadAction(formData);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName('');
        setPhone('');
        setEmail('');
      }, 2000);
    } else {
      setError(result.error || 'Erro ao enviar');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-surface max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold text-brand-text">
            Tenho Interesse
          </h2>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-text transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-brand-muted mb-4">
          Deixe seus dados para <span className="text-brand-primary font-semibold">{productName}</span>
        </p>

         {loading ? (
           <div className="text-center py-8 space-y-4">
             <div className="animate-pulse space-y-3">
               <div className="h-4 bg-brand-surface w-3/4 mx-auto"></div>
               <div className="h-4 bg-brand-surface w-1/2 mx-auto"></div>
               <div className="h-10 bg-brand-surface w-full"></div>
             </div>
             <p className="text-sm text-brand-muted font-mono">Salvando interesse...</p>
           </div>
         ) : success ? (
           <div className="text-center py-8">
             <Heart size={32} className="text-[#00FF00] fill-[#00FF00] mx-auto mb-3" />
             <div className="text-brand-text text-lg font-semibold mb-2">Interesse registrado!</div>
             <p className="text-sm text-brand-muted">Entraremos em contato em breve.</p>
           </div>
         ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-brand-muted mb-1">
                Nome *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
               className="w-full px-3 py-2 bg-brand-background border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
               placeholder="Seu nome completto"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-mono text-brand-muted mb-1">
                Telefone *
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 bg-brand-background border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono text-brand-muted mb-1">
                Email (opcional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-brand-background border border-brand-border text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                placeholder="seu@email.com"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || !name || !phone}
              leftIcon={<Send size={14} />}
            >
              {loading ? 'Enviando...' : 'Enviar Interesse'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
