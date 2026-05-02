import { SiteSettings } from '@/types/settings.types';
import { SITE_INFO } from '@/constants/site-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/settings`, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching site settings, using fallback:', error);
    
    // Fallback to SITE_INFO if API is unavailable
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
