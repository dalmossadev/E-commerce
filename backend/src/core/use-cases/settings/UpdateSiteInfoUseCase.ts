import { ISettingsRepository } from '../../interfaces/ISettingsRepository';
import { Settings } from '../../domain/Settings';
import { SiteInfoDTO, GetSiteInfoUseCase } from './GetSiteInfoUseCase';

export class UpdateSiteInfoUseCase {
  constructor(
    private settingsRepository: ISettingsRepository,
    private getSiteInfoUseCase: GetSiteInfoUseCase
  ) {}

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

    return await this.getSiteInfoUseCase.execute();
  }
}
