import 'reflect-metadata';
import { AppDataSource } from './infrastructure/database/data-source';
import { TypeORMBannerRepository } from './infrastructure/database/repositories/TypeORMBannerRepository';
import { Banner } from './domain/Banner';
import { logger } from './infrastructure/logger/logger';

async function seedBanners() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected.');

    const repository = new TypeORMBannerRepository();

    // Clear existing banners
    const existing = await repository.findAll();
    for (const banner of existing) {
      if (banner.id) await repository.delete(banner.id);
    }

    // Create a normal banner
    const banner1 = new Banner({
      title: 'PRODUTOS\nINCRÍVEIS',
      subtitle: 'Teste de banner normal',
      cta: 'Comprar',
      ctaHref: '#catalogo',
      desktopImage: 'produto-10.webp',
      mobileImage: 'produto-11.webp',
      altText: 'Banner normal',
      priority: false
    });

    // Create a priority banner
    const banner2 = new Banner({
      title: 'SUPER\nPROMOÇÃO',
      subtitle: 'Teste de banner prioritário',
      cta: 'Aproveitar',
      ctaHref: '#ofertas',
      desktopImage: 'produto-12.webp',
      mobileImage: 'produto-13.webp',
      altText: 'Banner prioritário',
      priority: true
    });

    await repository.create(banner1);
    await repository.create(banner2);

    logger.info('Banners criados com sucesso!');
    process.exit(0);
  } catch (error) {
    logger.error('Erro ao popular banners:', error);
    process.exit(1);
  }
}

seedBanners();
