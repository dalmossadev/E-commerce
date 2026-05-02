import { IProductRepository } from '../../interfaces/IProductRepository';
import { Product } from '../../domain/Product';

export interface RegionAvailability {
  product: Product;
  availableInStock: boolean;
  region: string;
  estimatedDeliveryHours: number;
}

export class GetProductsByRegionUseCase {
  private readonly regionConfig = {
    'salvador': { deliveryHours: 4, coordinates: { lat: -12.9714, lng: -38.5124 } },
    'simoes_filho': { deliveryHours: 12, coordinates: { lat: -12.7833, lng: -38.6333 } },
  };

  constructor(private productRepository: IProductRepository) {}

  async execute(region: string): Promise<RegionAvailability[]> {
    const normalizedRegion = region.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const result = await this.productRepository.findAll();
    const products = result.data;
    
    return products.map((product: Product) => {
      const hasInStockVariants = product.variants?.some(v => 
        v.fulfillmentType === 'IN_STOCK' && v.inStock
      ) || false;
      
      let estimatedDeliveryHours = 24; // default
      
      if (normalizedRegion.includes('salvador')) {
        estimatedDeliveryHours = hasInStockVariants ? 4 : 12;
      } else if (normalizedRegion.includes('simoes')) {
        estimatedDeliveryHours = hasInStockVariants ? 12 : 24;
      }
      
      return {
        product,
        availableInStock: hasInStockVariants,
        region: region,
        estimatedDeliveryHours,
      };
    });
  }

  isProntaEntrega(region: string, product: Product): boolean {
    const normalizedRegion = region.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (!normalizedRegion.includes('salvador')) {
      return false;
    }
    
    return product.variants?.some(v => 
      v.fulfillmentType === 'IN_STOCK' && v.inStock
    ) || false;
  }
}
