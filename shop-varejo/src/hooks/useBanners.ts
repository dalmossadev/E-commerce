import { useState, useEffect, useCallback } from 'react';
import { Banner } from '@/types/interfaces';
import { bannerService } from '@/lib/api/services/bannerService';

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.list();
      setBanners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar banners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const createBanner = async (data: Partial<Banner>) => {
    const result = await bannerService.create(data);
    await fetchBanners();
    return result;
  };

  const updateBanner = async (id: string, data: Partial<Banner>) => {
    const result = await bannerService.update(id, data);
    await fetchBanners();
    return result;
  };

  const deleteBanner = async (id: string) => {
    await bannerService.delete(id);
    await fetchBanners();
  };

  const uploadBannerImage = async (id: string, type: 'desktop' | 'mobile', file: File) => {
    const imageUrl = await bannerService.uploadImage(id, type, file);
    await fetchBanners();
    return imageUrl;
  };

  return {
    banners,
    loading,
    error,
    refetch: fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    uploadBannerImage
  };
}
