import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "@core/domain/Product";
import { ProductVariant } from "@core/domain/ProductVariant";
import { ProductSchema } from "../mappers/ProductSchema";
import { ProductVariantSchema } from "../mappers/ProductVariantSchema";
import { IProductRepository, ProductQueryOptions, PaginatedResult } from "@core/interfaces/IProductRepository";

export class TypeORMProductRepository implements IProductRepository {
  private repository: Repository<Product>;
  private variantRepository: Repository<ProductVariant>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductSchema);
    this.variantRepository = AppDataSource.getRepository(ProductVariantSchema);
  }

  async save(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }

  async findBySku(sku: string): Promise<Product | null> {
    return await this.repository.findOne({ 
      where: {
        variants: { sku }
      },
      relations: ['variants', 'category']
    });
  }

  async findAll(options?: ProductQueryOptions): Promise<PaginatedResult<Product>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant');

    if (options?.categorySlug) {
      queryBuilder.innerJoinAndSelect('product.category', 'category');
      queryBuilder.where('category.slug = :categorySlug', { categorySlug: options.categorySlug });
    } else {
      queryBuilder.leftJoinAndSelect('product.category', 'category');
    }

    if (options?.categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId: options.categoryId });
    }

    if (options?.featured !== undefined) {
      queryBuilder.andWhere('product.featured = :featured', { featured: options.featured });
    }

    if (options?.search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    if (options?.minPrice !== undefined) {
      queryBuilder.andWhere('product.basePrice >= :minPrice', { minPrice: options.minPrice });
    }

    if (options?.maxPrice !== undefined) {
      queryBuilder.andWhere('product.basePrice <= :maxPrice', { maxPrice: options.maxPrice });
    }

    if (options?.sortBy) {
      const sortColumn = `product.${options.sortBy}`;
      queryBuilder.orderBy(sortColumn, options.sortOrder || 'DESC');
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: number): Promise<Product | undefined> {
    const product = await this.repository.findOne({ 
      where: { id },
      relations: ['variants', 'category']
    });
    return product || undefined;
  }

  async update(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async search(query: string): Promise<Product[]> {
    return await this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .where('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('product.description LIKE :query', { query: `%${query}%` })
      .orWhere('product.brand LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.repository.find({ 
      where: { categoryId },
      relations: ['variants', 'category']
    });
  }

  async count(categoryId?: number): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('product');
    if (categoryId) {
      queryBuilder.where('product.categoryId = :categoryId', { categoryId });
    }
    return await queryBuilder.getCount();
  }

  async findVariantById(variantId: number): Promise<ProductVariant | undefined> {
    const variant = await this.variantRepository.findOne({ 
      where: { id: variantId }
    });
    return variant || undefined;
  }

  async updateVariant(variant: ProductVariant): Promise<ProductVariant> {
    return await this.variantRepository.save(variant);
  }

  async updateImage(sku: string, imageUrl: string): Promise<void> {
    const product = await this.findBySku(sku);
    if (product) {
      // Extrai o filename da URL completa ou usa diretamente se for apenas o filename
      const filename = imageUrl.includes('/') 
        ? imageUrl.split('/').pop() || imageUrl 
        : imageUrl;
      product.imageName = filename;
      await this.repository.save(product);
    }
  }

  async countAll(): Promise<number> {
    return await this.repository.count();
  }

  async countLowStockVariants(threshold: number): Promise<number> {
    return await this.variantRepository
      .createQueryBuilder('variant')
      .where('variant.stock < :threshold', { threshold })
      .getCount();
  }
  async findAllVariants(): Promise<ProductVariant[]> {
    return await this.variantRepository.find({
      relations: ['product']
    });
  }
}
