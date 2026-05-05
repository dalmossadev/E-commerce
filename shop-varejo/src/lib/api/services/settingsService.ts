import { SiteSettings } from '@/types/settings.types';
import { SITE_INFO } from '@/constants/site-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/site/info`, {
      cache: 'no-store', // Always get latest for now
    });

    if (!response.ok) {
      throw new Error('Failed to fetch site info');
    }

    const data = await response.json();
    
    return {
      site_name: data.name,
      site_tagline: data.tagline,
      site_description: data.description,
      whatsapp_number: data.whatsappNumber,
      whatsapp_message: data.whatsappMessage,
      instagram_url: data.instagramUrl,
    };
  } catch (error) {
    console.error('Error fetching site info, using fallback:', error);
    
    return {
      site_name: SITE_INFO.name,
      site_tagline: SITE_INFO.tagline,
      site_description: SITE_INFO.description,
      whatsapp_number: SITE_INFO.whatsapp.number,
      whatsapp_message: SITE_INFO.whatsapp.message,
      instagram_url: SITE_INFO.social.instagram,
    };
  }
}
