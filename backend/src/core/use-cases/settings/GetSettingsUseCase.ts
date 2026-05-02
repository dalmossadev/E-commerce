import { ISettingsRepository } from '@core/interfaces/ISettingsRepository';

export interface SiteSettingsDTO {
  site_name: string;
  site_tagline: string;
  site_description: string;
  whatsapp_number: string;
  whatsapp_message: string;
  instagram_url: string;
}

export class GetSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(): Promise<SiteSettingsDTO> {
    const settings = await this.settingsRepository.findAll();
    
    const findValue = (key: string, defaultValue: string): string => {
      return settings.find(s => s.key === key)?.value || defaultValue;
    };

    return {
      site_name: findValue('site_name', 'SHOP VAREJO'),
      site_tagline: findValue('site_tagline', 'Produtos selecionados. Qualidade garantida.'),
      site_description: findValue('site_description', 'E-commerce premium com estoque selecionado e entrega via WhatsApp.'),
      whatsapp_number: findValue('site_whatsapp_number', '557187833065'),
      whatsapp_message: findValue('site_whatsapp_message', 'Olá! Vi o site e tenho interesse em um produto.'),
      instagram_url: findValue('site_instagram_url', 'https://instagram.com/shopvarejo'),
    };
  }
}
