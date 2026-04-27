// Use Case para popular a base de dados com produtos e variantes
import { Product } from "../domain/Product";
import { ProductVariant } from "../domain/ProductVariant";
import { IProductRepository } from "../interfaces/IProductRepository";
import { SkuService } from "../domain/services/SkuService";
import { ProductData } from "../interfaces/IProductSKU"; // Usando o novo contrato

export class SeedProductsUseCase {
  constructor(
    private productRepository: IProductRepository,
    private skuService: SkuService
  ) {}

  async execute(productsData: ProductData[]): Promise<void> {
    console.log(`---🚀 Iniciando migração de ${productsData.length} produtos---`);

    for (const data of productsData) {
      // 1. Instancia o Produto Pai (Campos globais)
      const product = new Product();
      product.name = data.name;
      product.brand = data.brand;
      product.category = data.category;
      product.basePrice = data.basePrice;

      // 2. Gera o produto cartesiano de variantes
      const variants: ProductVariant[] = [];

      for (const color of data.attributes.colors) {
        for (const size of data.attributes.sizes) {
          const sku = this.skuService.generate({
            name: product.name,
            brand: product.brand,
            category: product.category,
            color,
            size
          });

          const variant = new ProductVariant();
          variant.sku = sku;
          variant.color = color;
          variant.size = size;
          variant.price = product.basePrice; // Preço base herdado na semente
          variant.stock = 10; // Estoque padrão para seed

          variants.push(variant);
        }
      }

      product.variants = variants;

      // 3. Persistência única (Repository deve usar cascade)
      try {
        await this.productRepository.save(product);
        console.log(`✅ Produto [${product.name}] e suas ${variants.length} variantes salvos.`);
      } catch (error: any) {
        console.error(`❌ Erro ao salvar ${data.name}: ${error.message}`);
      }
    }

    console.log("---✨ Importação e Migração finalizadas!---");
  }
}