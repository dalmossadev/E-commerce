import { ISettingsRepository } from '@core/interfaces/ISettingsRepository';
import { Settings } from '@core/domain/Settings';

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

export class UpdateSiteInfoUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(data: Partial<SiteInfoDTO>): Promise<SiteInfoDTO> {
    const updates: Array<{ key: string; value: string }> = [];

    if (data.name !== undefined) {
      updates.push({ key: 'site_name', value: data.name });
    }
    if (data.tagline !== undefined) {
      updates.push({ key: 'site_tagline', value: data.tagline });
    }
    if (data.description !== undefined) {
      updates.push({ key: 'site_description', value: data.description });
    }
    if (data.whatsapp?.number !== undefined) {
      updates.push({ key: 'site_whatsapp_number', value: data.whatsapp.number });
    }
    if (data.whatsapp?.message !== undefined) {
      updates.push({ key: 'site_whatsapp_message', value: data.whatsapp.message });
    }
    if (data.social?.instagram !== undefined) {
      updates.push({ key: 'site_instagram_url', value: data.social.instagram });
    }

    for (const update of updates) {
      let setting = await this.settingsRepository.findByKey(update.key);
      
      if (setting) {
        setting.value = update.value;
        await this.settingsRepository.update(setting);
      } else {
        setting = new Settings({ key: update.key, value: update.value });
        await this.settingsRepository.save(setting);
      }
    }

    // Retorna o objeto atualizado
    const getUpdatedSiteInfo = new GetSiteInfoUseCase(this.settingsRepository);
    return await getUpdatedSiteInfo.execute();
  }
}
