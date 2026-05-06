'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { categoryService } from '@/lib/api/services/categoryService';
import { Category, Product, ProductBadge } from '@/types/interfaces';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Star, 
  Package, 
  XCircle,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/constants/site-config';

export default function AdminProductsPage() {
  const { 
    products, 
    loading, 
    error, 
    options, 
    setOptions, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage,
    refetch 
  } = useProducts({ limit: 50 });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    categoryId: 0,
    basePrice: 0,
    originalPrice: 0,
    description: '',
    featured: false,
    badge: null,
    inStock: true
  });

  useEffect(() => {
    categoryService.list('PRODUCT').then(setCategories);
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        // Ensure price is in normal format for input (though we'll convert to cents on save)
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        categoryId: categories[0]?.id || 0,
        basePrice: 0,
        originalPrice: 0,
        description: '',
        featured: false,
        badge: null,
        inStock: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Data mapping for backend (expects basePrice in centavos, but let's assume input is in Reais)
      const payload = {
        ...formData,
        // Conversion logic if needed
      };

      if (editingProduct) {
        await updateProduct(editingProduct.sku, payload);
      } else {
        await createProduct({
          ...payload,
          attributes: { colors: ['Preto'], sizes: ['M'] }, // Default attributes for now
          initialStock: 10
        });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar produto');
    }
  };

  const handleDelete = async (sku: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(sku);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao excluir produto');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sku: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadImage(sku, file);
      alert('Imagem atualizada com sucesso!');
      refetch();
    } catch (err) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Acessando Banco de Dados...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Gestão de <span className="text-[#00FF00]">Produtos</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Catálogo Relacional • Sprint 03
          </p>
        </div>
        <div className="flex gap-4">
           <Button 
            onClick={() => handleOpenModal()}
            className="bg-[#00FF00] text-black font-bold uppercase tracking-widest px-6 hover:bg-[#00DD00] transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] rounded-none"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Produto
          </Button>
        </div>
      </header>

      {/* FILTROS RAPIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="BUSCAR POR NOME OU SKU..."
            className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-xs font-mono text-white focus:border-[#00FF00] focus:outline-none transition-colors uppercase"
            onChange={(e) => setOptions({ ...options, search: e.target.value })}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <select 
            className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-xs font-mono text-white focus:border-[#00FF00] focus:outline-none transition-colors appearance-none uppercase"
            onChange={(e) => setOptions({ ...options, category: e.target.value })}
          >
            <option value="">TODAS AS CATEGORIAS</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug} className="bg-black">{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4">
          <input 
            type="checkbox" 
            id="featured-only"
            className="accent-[#00FF00]" 
            onChange={(e) => setOptions({ ...options, featured: e.target.checked || undefined })}
          />
          <label htmlFor="featured-only" className="text-[10px] font-mono text-white/50 uppercase tracking-widest cursor-pointer">
            Apenas Destaques
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 font-mono text-sm mb-8 uppercase tracking-wider flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> Erro: {error}
        </div>
      )}

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/50">
              <th className="p-4 text-xs font-mono uppercase tracking-widest">Produto / SKU</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest">Categoria</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest">Preço</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-center">Destaque</th>
              <th className="p-4 text-xs font-mono uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-[#00FF00]/50 transition-colors">
                      {product.imageName ? (
                        <img 
                          src={`/img/catalogo/${product.imageName}`} 
                          alt={product.name} 
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-white/20" />
                      )}
                      {product.badge && (
                        <div className="absolute top-0 right-0 bg-[#00FF00] text-black text-[6px] font-bold px-1 py-0.5 uppercase tracking-tighter">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white uppercase tracking-wider text-sm">{product.name}</div>
                      <div className="text-white/40 text-[10px] font-mono uppercase mt-1">{product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-[10px] text-[#00FF00] uppercase font-bold tracking-widest px-2 py-1 bg-[#00FF00]/5 border border-[#00FF00]/20 w-fit">
                    {product.category?.name || 'SEM CATEGORIA'}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-mono text-sm text-white">
                    {formatPrice(product.basePrice)}
                  </div>
                  {product.originalPrice && product.originalPrice > product.basePrice && (
                    <div className="text-[10px] text-white/30 line-through font-mono">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                </td>
                <td className="p-4 text-center">
                  {product.featured ? (
                    <Star className="w-4 h-4 text-[#00FF00] mx-auto fill-[#00FF00]" />
                  ) : (
                    <Star className="w-4 h-4 text-white/10 mx-auto" />
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="p-2 text-white/40 hover:text-[#00FF00] transition-colors cursor-pointer" title="Upload Imagem">
                      <Upload className="w-4 h-4" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, product.sku)}
                      />
                    </label>
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-white/40 hover:text-[#00FF00] transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.sku)}
                      className="p-2 text-white/40 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL PRODUTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
          <div className="bg-black border border-white/20 w-full max-w-4xl shadow-[0_0_50px_rgba(0,0,0,1)] relative my-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF00]" />
            
            <header className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold uppercase tracking-[0.2em]">
                {editingProduct ? 'EDITAR' : 'NOVO'} <span className="text-[#00FF00]">PRODUTO</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Nome */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Nome do Produto *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors uppercase"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* SKU (Somente Leitura na edição) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">SKU {editingProduct ? '(IMUTÁVEL)' : '*'}</label>
                  <input 
                    required={!editingProduct}
                    disabled={!!editingProduct}
                    placeholder="EX: TENIS-RUN-001"
                    className={`w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors uppercase ${editingProduct ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>

                {/* Marca */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Marca *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors uppercase"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Categoria *</label>
                  <select 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors appearance-none uppercase"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                  >
                    <option value={0} disabled className="bg-black">SELECIONE</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-black">{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Badge */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Badge (Etiqueta)</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors appearance-none uppercase"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({...formData, badge: (e.target.value as ProductBadge) || null})}
                  >
                    <option value="" className="bg-black">NENHUMA</option>
                    <option value="novo" className="bg-black text-[#00FF00]">NOVO</option>
                    <option value="oferta" className="bg-black text-yellow-400">OFERTA</option>
                    <option value="exclusivo" className="bg-black text-purple-400">EXCLUSIVO</option>
                    <option value="esgotando" className="bg-black text-red-400">ESGOTANDO</option>
                  </select>
                </div>

                {/* Preço Base */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Preço Atual (Centavos) *</label>
                  <input 
                    required
                    type="number"
                    placeholder="EX: 19990 para R$199,90"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: Number(e.target.value)})}
                  />
                </div>

                {/* Preço Original */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Preço Original (Centavos)</label>
                  <input 
                    type="number"
                    placeholder="OPCIONAL PARA EXIBIR DESCONTO"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value) || undefined})}
                  />
                </div>

                {/* Destaque */}
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 h-[58px] mt-6">
                  <input 
                    type="checkbox" 
                    id="featured-check"
                    className="w-5 h-5 accent-[#00FF00] cursor-pointer" 
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <label htmlFor="featured-check" className="text-xs font-mono text-white/70 uppercase tracking-widest cursor-pointer select-none">
                    PRODUTO EM DESTAQUE
                  </label>
                </div>

                {/* Descrição */}
                <div className="space-y-2 lg:col-span-3">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Descrição Técnica</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors text-sm"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 border-t border-white/10 pt-8 mt-12">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 border border-white/10 text-white/50 font-mono uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="px-12 py-4 bg-[#00FF00] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#00DD00] transition-all shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                >
                  {editingProduct ? 'ATUALIZAR SISTEMA' : 'INCLUIR NO CATÁLOGO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
