'use client';

import { useSettings } from '@/contexts/SettingsContext';

export interface SiteInfo {
  name: string;
  tagline: string;
  description: string;
  whatsapp: {
    number: string;
    message: string;
  };
  social: {
    instagram: string;
  };
}

export function useSiteInfo() {
  const settings = useSettings();

  const siteInfo: SiteInfo = {
    name: settings.site_name,
    tagline: settings.site_tagline,
    description: settings.site_description,
    whatsapp: {
      number: settings.whatsapp_number,
      message: settings.whatsapp_message,
    },
    social: {
      instagram: settings.instagram_url,
    },
  };

  return { 
    siteInfo, 
    loading: false, 
    error: null 
  };
}
