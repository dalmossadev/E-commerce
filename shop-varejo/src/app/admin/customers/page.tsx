'use client';

import { useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer, Address } from '@/types/interfaces';
import { Plus, Edit2, Trash2, Phone, User, Mail, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAddresses } from '@/hooks/useAddresses';

export default function AdminCustomersPage() {
  const { customers, loading, error, createCustomer, updateCustomer, deleteCustomer, refetch } = useCustomers();
  const { createAddress, updateAddress, deleteAddress, setMainAddress } = useAddresses();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    fullName: '',
    cpf: '',
    phone: ''
  });

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        fullName: '',
        cpf: '',
        phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCustomer(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao excluir cliente');
      }
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Carregando Clientes...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Gestão de <span className="text-[#00FF00]">Clientes</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Diretório de Consumidores • Sprint 03
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#00FF00] text-black font-bold uppercase tracking-widest px-6 hover:bg-[#00DD00] transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] rounded-none"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Cliente
        </Button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 font-mono text-sm mb-8 uppercase tracking-wider">
          Erro: {error}
        </div>
      )}

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50">Cliente / CPF</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50">Contato</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50">Endereço Principal</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-white uppercase tracking-wider">{customer.fullName}</div>
                  <div className="text-white/40 text-[10px] font-mono mt-1">{customer.cpf}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-xs text-white/60 gap-2">
                    <Phone className="w-3 h-3 text-[#00FF00]" /> {customer.phone}
                  </div>
                </td>
                <td className="p-4">
                  {customer.addresses && customer.addresses.length > 0 ? (
                    <div className="flex items-center text-[10px] text-white/40 gap-2">
                      <MapPin className="w-3 h-3 text-[#00FF00]" /> 
                      {customer.addresses.find(a => a.isMain)?.city || customer.addresses[0].city} - 
                      {customer.addresses.find(a => a.isMain)?.state || customer.addresses[0].state}
                    </div>
                  ) : (
                    <div className="text-[10px] text-white/20 italic font-mono uppercase">Sem endereço</div>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(customer)}
                      className="p-2 text-white/40 hover:text-[#00FF00] transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-white/40 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-white/30 font-mono uppercase tracking-widest">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL - Industrial Style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-black border border-white/20 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,1)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF00]" />
            
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-[0.2em]">
                {editingCustomer ? 'Editar' : 'Novo'} <span className="text-[#00FF00]">Cliente</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Nome Completo *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">CPF *</label>
                  <input 
                    required
                    placeholder="000.000.000-00"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Telefone *</label>
                  <input 
                    required
                    placeholder="(00) 00000-0000"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Endereços Section */}
              {editingCustomer && (
                <div className="border-t border-white/10 pt-8 mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#00FF00]" /> Endereços de Entrega
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-[10px] font-mono uppercase tracking-widest text-[#00FF00] hover:underline"
                    >
                      + Adicionar Endereço
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingCustomer.addresses?.map((address) => (
                      <div key={address.id} className="border border-white/10 p-4 bg-white/5 relative group">
                        {address.isMain && (
                          <div className="absolute top-0 right-0 bg-[#00FF00] text-black text-[8px] font-bold px-2 py-1 uppercase tracking-tighter">
                            Principal
                          </div>
                        )}
                        <div className="text-xs font-bold text-white uppercase mb-1">{address.tag || 'Casa'}</div>
                        <div className="text-[10px] text-white/50 font-mono">
                          {address.street}, {address.number} {address.complement && `(${address.complement})`}
                        </div>
                        <div className="text-[10px] text-white/50 font-mono">
                          {address.neighborhood}, {address.city} - {address.state}
                        </div>
                        <div className="text-[10px] text-white/50 font-mono mt-1">CEP: {address.zipCode}</div>
                        
                        <div className="flex gap-4 mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!address.isMain && (
                            <button 
                              type="button"
                              onClick={() => setMainAddress(address.id, editingCustomer.id, 'CUSTOMER').then(() => refetch())}
                              className="text-[8px] font-mono uppercase tracking-widest text-[#00FF00]"
                            >
                              Definir Principal
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => {
                              if(confirm('Excluir este endereço?')) {
                                deleteAddress(address.id).then(() => refetch());
                              }
                            }}
                            className="text-[8px] font-mono uppercase tracking-widest text-red-500"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!editingCustomer.addresses || editingCustomer.addresses.length === 0) && (
                      <div className="md:col-span-2 text-center py-8 border border-dashed border-white/10 text-white/30 text-[10px] font-mono uppercase tracking-widest">
                        Nenhum endereço cadastrado para este cliente.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 border-t border-white/10 pt-6 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-white/10 text-white/50 font-mono uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-[#00FF00] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#00DD00] transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                >
                  {editingCustomer ? 'Salvar Alterações' : 'Criar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADDRESS MODAL */}
      {isAddressModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-black border border-[#00FF00]/30 w-full max-w-lg shadow-[0_0_100px_rgba(0,255,0,0.1)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF00]" />
            
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-[0.2em]">
                Novo <span className="text-[#00FF00]">Endereço</span>
              </h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </header>

            <form 
              className="p-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  street: formData.get('street') as string,
                  number: formData.get('number') as string,
                  complement: formData.get('complement') as string,
                  neighborhood: formData.get('neighborhood') as string,
                  city: formData.get('city') as string,
                  state: formData.get('state') as string,
                  zipCode: formData.get('zipCode') as string,
                  tag: formData.get('tag') as string,
                  isMain: formData.get('isMain') === 'on',
                  customerId: editingCustomer.id,
                };

                try {
                  await createAddress(data);
                  await refetch();
                  setIsAddressModalOpen(false);
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Erro ao salvar endereço');
                }
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Identificação (Ex: Casa, Trabalho...)</label>
                  <input name="tag" required placeholder="Casa" className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">CEP</label>
                  <input 
                    name="zipCode" 
                    required 
                    placeholder="00000-000"
                    className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" 
                    onBlur={async (e) => {
                      const cep = e.target.value.replace(/\D/g, '');
                      if (cep.length === 8) {
                        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                        const data = await res.json();
                        if (!data.erro) {
                          const form = e.target.form;
                          if(form) {
                            (form.elements.namedItem('street') as HTMLInputElement).value = data.logradouro;
                            (form.elements.namedItem('neighborhood') as HTMLInputElement).value = data.bairro;
                            (form.elements.namedItem('city') as HTMLInputElement).value = data.localidade;
                            (form.elements.namedItem('state') as HTMLInputElement).value = data.uf;
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Logradouro / Rua</label>
                  <input name="street" required className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Número</label>
                  <input name="number" required className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Complemento</label>
                  <input name="complement" className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Bairro</label>
                  <input name="neighborhood" required className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Cidade</label>
                  <input name="city" required className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Estado (UF)</label>
                  <input name="state" required maxLength={2} className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono uppercase" />
                </div>
                <div className="flex items-center gap-2 col-span-2 pt-2">
                  <input type="checkbox" name="isMain" id="isMain" className="accent-[#00FF00]" />
                  <label htmlFor="isMain" className="text-[10px] font-mono uppercase tracking-widest text-white/60">Definir como Principal</label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-white/50 font-mono uppercase tracking-widest text-[10px] hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#00FF00] text-black font-bold uppercase tracking-widest text-[10px] hover:bg-[#00DD00]"
                >
                  Salvar Endereço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
