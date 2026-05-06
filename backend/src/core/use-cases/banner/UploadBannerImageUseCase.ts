import { IBannerRepository } from "@core/interfaces/IBannerRepository";
import path from "path";
import fs from "fs";

export class UploadBannerImageUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(id: string, type: 'desktop' | 'mobile', file: any): Promise<string> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) throw new Error("Banner não encontrado");

    const extension = path.extname(file.originalname);
    const fileName = `banner-${id}-${type}-${Date.now()}${extension}`;
    
    // Caminho absoluto para a pasta de imagens do frontend
    // Ajuste conforme a estrutura real do projeto
    const uploadPath = path.resolve(__dirname, "../../../../../../shop-varejo/public/img/banners", fileName);

    // Salvar o arquivo
    fs.writeFileSync(uploadPath, file.buffer);

    // Atualizar no banco
    const updateData = type === 'desktop' 
      ? { desktopImage: fileName } 
      : { mobileImage: fileName };
    
    await this.bannerRepository.update(id, updateData);

    return fileName;
  }
}
