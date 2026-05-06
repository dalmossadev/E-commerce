import 'dotenv/config';
import { AppDataSource } from '@infrastructure/database/data-source';
import { TypeORMProductRepository } from '@infrastructure/database/repositories/TypeORMProductRepository';
import { SeedProductsUseCase } from '@core/use-cases/SeedProductsUseCase';
import { SkuService } from '@core/domain/services/SkuService';

// Simulando os dados que vieram do seu frontend (site-config.ts)
const FRONTEND_PRODUCTS = [
  {
    name: 'Tênis Runner Pro X',
    brand: 'Nike',
    categoryId: 1, // Geral
    basePrice: 19990,
    description: 'Amortecimento de alta performance para corridas urbanas.',
    originalPrice: 27990,
    badge: 'oferta' as any,
    featured: true,
    attributes: {
      colors: ['preto', 'branco'],
      sizes: ['p', 'm', 'g']
    }
  },
  {
    name: 'Mochila Urban Carry 30L',
    brand: 'Urban',
    categoryId: 1, // Geral
    basePrice: 14990,
    description: 'Mochila impermeável para o dia a dia.',
    badge: 'novo' as any,
    featured: true,
    attributes: {
      colors: ['preto', 'azul'],
      sizes: ['unico']
    }
  }
];

async function runSeed() {
  try {
    await AppDataSource.initialize();
    
    const repository = new TypeORMProductRepository();
    const skuService = new SkuService();
    const seedUseCase = new SeedProductsUseCase(repository, skuService);

    await seedUseCase.execute(FRONTEND_PRODUCTS);

    process.exit(0);
  } catch (error) {
    console.error("Erro no Seed:", error);
    process.exit(1);
  }
}

runSeed();