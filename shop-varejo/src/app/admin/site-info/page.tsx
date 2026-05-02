'use client';

import { useState, useEffect } from 'react';
import { useSiteInfo, SiteInfo } from '@/hooks/useSiteInfo';
import { Button } from '@/components/ui/Button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SiteInfoAdminPage() {
  const { siteInfo, loading, error } = useSiteInfo();
  const [formData, setFormData] = useState<SiteInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (siteInfo) {
      setFormData(siteInfo);
    }
  }, [siteInfo]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Erro ao carregar: {error.message}</div>;
  if (!formData) return null;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      
      if (field.startsWith('whatsapp.')) {
        const whatsappField = field.split('.')[1];
        return {
          ...prev,
          whatsapp: {
            ...prev.whatsapp,
            [whatsappField]: value
          }
        };
      }
      
      if (field.startsWith('social.')) {
        const socialField = field.split('.')[1];
        return {
          ...prev,
          social: {
            ...prev.social,
            [socialField]: value
          }
        };
      }
      
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/site-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar');
      }

      setSaveMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage(`Erro: ${err instanceof Error ? err.message : 'Desconhecido'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-400">Configurações do Site</h1>
        
        {saveMessage && (
          <div className={`p-4 mb-6 rounded ${saveMessage.includes('Erro') ? 'bg-red-800' : 'bg-green-800'}`}>
            {saveMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Site</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">WhatsApp</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Número (com DDD)</label>
                <input
                  type="text"
                  value={formData.whatsapp.number}
                  onChange={(e) => handleChange('whatsapp.number', e.target.value)}
                  placeholder="5571999999999"
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem Padrão</label>
                <textarea
                  value={formData.whatsapp.message}
                  onChange={(e) => handleChange('whatsapp.message', e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Redes Sociais</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Instagram URL</label>
              <input
                type="text"
                value={formData.social.instagram}
                onChange={(e) => handleChange('social.instagram', e.target.value)}
                placeholder="https://instagram.com/seuusuario"
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
            
            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3"
            >
              Cancelar
            </Button>
          </div>
        </form>

        {/* Preview */}
        <div className="mt-12 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-300">Preview</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Nome:</strong> {formData.name}</p>
            <p><strong>Tagline:</strong> {formData.tagline}</p>
            <p><strong>WhatsApp:</strong> {formData.whatsapp.number}</p>
            <p><strong>Instagram:</strong> {formData.social.instagram}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
