import { ISettingsRepository } from '../../interfaces/ISettingsRepository';

export interface SiteInfoDTO {
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

export class GetSiteInfoUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(): Promise<SiteInfoDTO> {
    const keys = [
      'site_name',
      'site_tagline',
      'site_description',
      'site_whatsapp_number',
      'site_whatsapp_message',
      'site_instagram_url',
    ];

    const settings = await Promise.all(
      keys.map(key => this.settingsRepository.findByKey(key))
    );

    const getSettingValue = (index: number, defaultValue: string): string => {
      return settings[index]?.value || defaultValue;
    };

    return {
      name: getSettingValue(0, 'SHOP VAREJO'),
      tagline: getSettingValue(1, 'Produtos selecionados. Qualidade garantida.'),
      description: getSettingValue(2, 'E-commerce premium com estoque selecionado e entrega via WhatsApp.'),
      whatsapp: {
        number: getSettingValue(3, '557187833065'),
        message: getSettingValue(4, 'Olá! Vi o site e tenho interesse em um produto.'),
      },
      social: {
        instagram: getSettingValue(5, 'https://instagram.com/shopvarejo'),
      },
    };
  }
}
