'use client';

import { useState } from 'react';
import { useSuppliers, Supplier } from '@/hooks/useSuppliers';
import { categoryService } from '@/lib/api/services/categoryService';
import { Category } from '@/types/interfaces';
import { Plus, Edit2, Trash2, Globe, Phone, Mail, Building2, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAddresses, Address } from '@/hooks/useAddresses';

export default function SuppliersPage() {
  const { suppliers, loading, error, createSupplier, updateSupplier, deleteSupplier, refetch } = useSuppliers();
  const { createAddress, updateAddress, deleteAddress, setMainAddress } = useAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    companyName: '',
    tradeName: '',
    cnpj: '',
    contactEmail: '',
    phone: '',
    website: '',
    categoryId: 0,
    status: 'ACTIVE'
  });

  useState(() => {
    categoryService.list('SUPPLIER').then(setCategories);
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({
        companyName: '',
        tradeName: '',
        cnpj: '',
        contactEmail: '',
        phone: '',
        website: '',
        categoryId: 0,
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData);
      } else {
        await createSupplier(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar fornecedor');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await deleteSupplier(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao excluir fornecedor');
      }
    }
  };

  if (loading && suppliers.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Carregando Fornecedores...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Gestão de <span className="text-[#00FF00]">Fornecedores</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Diretório Industrial • Sprint 03
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#00FF00] text-black font-bold uppercase tracking-widest px-6 hover:bg-[#00DD00] transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] rounded-none"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
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
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50">Empresa / Fantasia</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50">CNPJ / Categoria</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50">Contato</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50">Status</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-white/50 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-white uppercase tracking-wider">{supplier.companyName}</div>
                  <div className="text-white/40 text-[10px] font-mono uppercase mt-1">{supplier.tradeName || '---'}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-mono text-white/80">{supplier.cnpj}</div>
                  <div className="text-[10px] text-[#00FF00] uppercase font-bold mt-1 tracking-tighter">{supplier.category?.name || 'Sem Categoria'}</div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-xs text-white/60 gap-2">
                      <Mail className="w-3 h-3" /> {supplier.contactEmail}
                    </div>
                    {supplier.phone && (
                      <div className="flex items-center text-xs text-white/60 gap-2">
                        <Phone className="w-3 h-3" /> {supplier.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {supplier.addresses && supplier.addresses.length > 0 ? (
                      <div className="flex items-center text-[10px] text-white/40 gap-2">
                        <MapPin className="w-3 h-3 text-[#00FF00]" /> 
                        {supplier.addresses.find(a => a.isMain)?.city || supplier.addresses[0].city} - 
                        {supplier.addresses.find(a => a.isMain)?.state || supplier.addresses[0].state}
                      </div>
                    ) : (
                      <div className="text-[10px] text-white/20 italic font-mono uppercase">Sem endereço</div>
                    )}
                    <Badge variant={supplier.status === 'ACTIVE' ? 'success' : 'outline'} className="rounded-none font-mono text-[10px] tracking-widest w-fit">
                      {supplier.status}
                    </Badge>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(supplier)}
                      className="p-2 text-white/40 hover:text-[#00FF00] transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(supplier.id)}
                      className="p-2 text-white/40 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-white/30 font-mono uppercase tracking-widest">
                  Nenhum fornecedor encontrado.
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
                {editingSupplier ? 'Editar' : 'Novo'} <span className="text-[#00FF00]">Fornecedor</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Razão Social *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Nome Fantasia</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.tradeName}
                    onChange={(e) => setFormData({...formData, tradeName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">CNPJ *</label>
                  <input 
                    required
                    placeholder="00.000.000/0000-00"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Categoria *</label>
                  <select 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors appearance-none"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                  >
                    <option value="" disabled className="bg-black text-white">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-black text-white">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Email de Contato *</label>
                  <input 
                    required
                    type="email"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Telefone</label>
                  <input 
                    placeholder="(00) 00000-0000"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Website</label>
                  <input 
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
                {editingSupplier && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Status</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors appearance-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE'})}
                    >
                      <option value="ACTIVE" className="bg-black text-white">ACTIVE</option>
                      <option value="INACTIVE" className="bg-black text-white">INACTIVE</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Endereços Section */}
              {editingSupplier && (
                <div className="border-t border-white/10 pt-8 mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#00FF00]" /> Endereços Cadastrados
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
                    {editingSupplier.addresses?.map((address) => (
                      <div key={address.id} className="border border-white/10 p-4 bg-white/5 relative group">
                        {address.isMain && (
                          <div className="absolute top-0 right-0 bg-[#00FF00] text-black text-[8px] font-bold px-2 py-1 uppercase tracking-tighter">
                            Principal
                          </div>
                        )}
                        <div className="text-xs font-bold text-white uppercase mb-1">{address.tag || 'Endereço'}</div>
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
                              onClick={() => setMainAddress(address.id, editingSupplier.id, 'SUPPLIER').then(() => refetch())}
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
                    {(!editingSupplier.addresses || editingSupplier.addresses.length === 0) && (
                      <div className="md:col-span-2 text-center py-8 border border-dashed border-white/10 text-white/30 text-[10px] font-mono uppercase tracking-widest">
                        Nenhum endereço cadastrado para este fornecedor.
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
                  {editingSupplier ? 'Salvar Alterações' : 'Criar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ADDRESS MODAL */}
      {isAddressModalOpen && editingSupplier && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-black border border-[#00FF00]/30 w-full max-w-lg shadow-[0_0_100px_rgba(0,255,0,0.1)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF00]" />
            
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-[0.2em]">
                Adicionar <span className="text-[#00FF00]">Endereço</span>
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
                  supplierId: editingSupplier.id,
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
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/40">Identificação (Ex: Matriz, Filial...)</label>
                  <input name="tag" required className="w-full bg-white/5 border border-white/10 p-2 text-sm text-white focus:border-[#00FF00] focus:outline-none font-mono" />
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
                  <label htmlFor="isMain" className="text-[10px] font-mono uppercase tracking-widest text-white/60">Definir como Endereço Principal</label>
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
