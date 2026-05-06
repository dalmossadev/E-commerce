'use client';

import { useState } from 'react';
import { useBanners } from '@/hooks/useBanners';
import { Banner } from '@/types/interfaces';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Monitor, 
  Smartphone, 
  Star, 
  XCircle,
  Upload,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminBannersPage() {
  const { 
    banners, 
    loading, 
    error, 
    createBanner, 
    updateBanner, 
    deleteBanner, 
    uploadBannerImage,
    refetch 
  } = useBanners();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    cta: '',
    ctaHref: '',
    altText: '',
    priority: false
  });

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData(banner);
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        cta: '',
        ctaHref: '',
        altText: '',
        priority: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
      } else {
        await createBanner(formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        await deleteBanner(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao excluir banner');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(`${id}-${type}`);
      await uploadBannerImage(id, type, file);
      refetch();
    } catch (err) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(null);
    }
  };

  if (loading && banners.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#00FF00] font-mono tracking-widest uppercase">
          Sincronizando Banners...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-white mb-2">
            Gestão de <span className="text-[#00FF00]">Banners</span>
          </h1>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Marketing Visual • Sprint 03
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#00FF00] text-black font-bold uppercase tracking-widest px-6 hover:bg-[#00DD00] transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] rounded-none"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Banner
        </Button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 font-mono text-sm mb-8 uppercase tracking-wider flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> Erro: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {banners.map((banner) => (
          <div key={banner.id} className="border border-white/10 bg-white/5 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF00]/20 group-hover:bg-[#00FF00] transition-colors" />
            
            {/* PREVIEW IMAGES */}
            <div className="grid grid-cols-2 h-40 border-b border-white/10">
              {/* Desktop Preview */}
              <div className="relative group/img bg-black flex items-center justify-center overflow-hidden border-r border-white/10">
                {banner.desktopImage ? (
                  <img 
                    src={`/img/banners/${banner.desktopImage}`} 
                    alt="Desktop" 
                    className="w-full h-full object-cover opacity-50 group-hover/img:opacity-80 transition-opacity"
                  />
                ) : (
                  <Monitor className="w-8 h-8 text-white/10" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60">
                   <label className="cursor-pointer p-2 bg-[#00FF00] text-black rounded-none font-bold text-[10px] uppercase tracking-tighter">
                    <Upload className="w-4 h-4 mx-auto mb-1" /> Desktop
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, banner.id, 'desktop')} />
                   </label>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[8px] font-mono text-white/40 uppercase">
                  <Monitor size={10} /> Desktop 1920x1080
                </div>
              </div>

              {/* Mobile Preview */}
              <div className="relative group/img bg-black flex items-center justify-center overflow-hidden">
                {banner.mobileImage ? (
                  <img 
                    src={`/img/banners/${banner.mobileImage}`} 
                    alt="Mobile" 
                    className="w-full h-full object-cover opacity-50 group-hover/img:opacity-80 transition-opacity"
                  />
                ) : (
                  <Smartphone className="w-8 h-8 text-white/10" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60">
                   <label className="cursor-pointer p-2 bg-[#00FF00] text-black rounded-none font-bold text-[10px] uppercase tracking-tighter">
                    <Upload className="w-4 h-4 mx-auto mb-1" /> Mobile
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, banner.id, 'mobile')} />
                   </label>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[8px] font-mono text-white/40 uppercase">
                  <Smartphone size={10} /> Mobile 1080x1920
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider text-lg">{banner.title.replace('\n', ' ')}</h3>
                  <p className="text-white/40 text-xs mt-1 font-mono">{banner.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  {banner.priority && (
                    <Badge variant="success" className="rounded-none font-mono text-[8px] uppercase tracking-widest bg-[#00FF00]/10 border-[#00FF00]/50 text-[#00FF00]">
                      LCP PRIORITY
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase mb-6">
                <span className="flex items-center gap-1">
                  <ExternalLink size={12} className="text-[#00FF00]" /> {banner.cta} ({banner.ctaHref})
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleOpenModal(banner)}
                  className="p-2 text-white/40 hover:text-[#00FF00] transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-white/40 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="lg:col-span-2 p-20 text-center border border-dashed border-white/10 text-white/20 font-mono uppercase tracking-[0.3em]">
            Nenhum banner ativo no sistema
          </div>
        )}
      </div>

      {/* MODAL BANNER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
          <div className="bg-black border border-white/20 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,1)] relative my-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF00]" />
            
            <header className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold uppercase tracking-[0.2em]">
                {editingBanner ? 'EDITAR' : 'NOVO'} <span className="text-[#00FF00]">BANNER</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titulo */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Título do Banner (Use \n para quebra) *</label>
                  <textarea 
                    required
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors uppercase"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                {/* Subtitulo */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Subtítulo *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors uppercase"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>

                {/* CTA Texto */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Texto do Botão (CTA) *</label>
                  <input 
                    required
                    placeholder="EX: VER CATALOGO"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors uppercase"
                    value={formData.cta}
                    onChange={(e) => setFormData({...formData, cta: e.target.value})}
                  />
                </div>

                {/* CTA Link */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Link do Botão (CTA Href) *</label>
                  <input 
                    required
                    placeholder="EX: #catalogo ou /produtos"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.ctaHref}
                    onChange={(e) => setFormData({...formData, ctaHref: e.target.value})}
                  />
                </div>

                {/* Alt Text */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Texto Alternativo (SEO/Acessibilidade) *</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#00FF00] focus:outline-none font-mono transition-colors"
                    value={formData.altText}
                    onChange={(e) => setFormData({...formData, altText: e.target.value})}
                  />
                </div>

                {/* Priority */}
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 h-[58px] md:col-span-2">
                  <input 
                    type="checkbox" 
                    id="priority-check"
                    className="w-5 h-5 accent-[#00FF00] cursor-pointer" 
                    checked={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.checked})}
                  />
                  <label htmlFor="priority-check" className="text-xs font-mono text-white/70 uppercase tracking-widest cursor-pointer select-none">
                    BANNER PRINCIPAL (LCP PRIORITY)
                  </label>
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
                  {editingBanner ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR BANNER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
