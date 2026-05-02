import { IProductRepository } from "@core/interfaces/IProductRepository";
import { NotFoundError } from "@core/errors/CustomErrors";
import * as fs from 'fs';
import * as path from 'path';

const PUBLIC_IMG_CATALOGO = path.join(process.cwd(), 'public', 'img', 'catalogo');

export class UploadProductImageUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(sku: string, file: Express.Multer.File): Promise<string> {
    const product = await this.productRepository.findBySku(sku);
    if (!product) {
      throw new NotFoundError("Product", sku);
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error('Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 5MB.');
    }

    if (!fs.existsSync(PUBLIC_IMG_CATALOGO)) {
      fs.mkdirSync(PUBLIC_IMG_CATALOGO, { recursive: true });
    }

    const ext = file.mimetype === 'image/png' ? '.png'
              : file.mimetype === 'image/jpeg' ? '.jpg'
              : '.webp';
    const fileName = `${sku}${ext}`;
    const destPath = path.join(PUBLIC_IMG_CATALOGO, fileName);

    fs.copyFileSync(file.path, destPath);
    fs.unlinkSync(file.path);

    const imageUrl = `/img/catalogo/${fileName}`;
    await this.productRepository.updateImage(sku, imageUrl);

    return imageUrl;
  }
}
