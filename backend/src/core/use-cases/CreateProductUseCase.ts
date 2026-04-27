import { Product } from "../domain/Product";
import { ProductVariant } from "../domain/ProductVariant";
import { SkuService } from "../domain/services/SkuService";
import { IProductRepository } from "../../core/interfaces/IProductRepository";
import { ProductData } from "@core/interfaces/IProductSKU";
export class CreateProductUseCase {
    constructor(
        private productRepository: IProductRepository,
        private skuService: SkuService
    ) {}

    /**
     * Orquestra a criação de um produto e suas variantes determinísticas.
     * @param data Dados validados vindos do DTO/Controller
     */
    async execute(data: ProductData): Promise<Product> {
        // 1. Instância e Mapeamento Completo da Entidade Pai
        const product = new Product();
        
        // Campos obrigatórios e opcionais para preencher a tabela 'product'
        product.name = data.name;
        product.brand = data.brand;
        product.category = data.category;
        product.basePrice = data.basePrice;
        
        // Garantindo que campos extras não fiquem vazios no banco
        
        product.description = data.description || ""; 
        product.originalPrice = data.originalPrice || null;
        product.badge = data.badge;
        product.specs = data.specs || null;
        product.featured = data.featured ?? false;
        product.inStock = true; // Produto pai inicia como ativo

        // 2. Geração do Produto Cartesiano de Variantes
        product.variants = this.generateVariants(product, data);

        // 3. Persistência Única (Aproveitando o Cascade do Repository)
        try {
            return await this.productRepository.save(product);
        } catch (error: any) {
            throw new Error(`Falha ao persistir produto e variantes: ${error.message}`);
        }
    }

    /**
     * Lógica isolada para geração de variantes (SRP - Single Responsibility Principle)
     */
    private generateVariants(product: Product, data: ProductData): ProductVariant[] {
        const variants: ProductVariant[] = [];

        for (const color of data.attributes.colors) {
            for (const size of data.attributes.sizes) {
                // Gera SKU único baseado na marca, nome, categoria, cor e tamanho
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
                variant.price = product.basePrice; // Herda preço base
                variant.stock = data.initialStock || 0; // Define estoque inicial

                variants.push(variant);
            }
        }

        return variants;
    }
}