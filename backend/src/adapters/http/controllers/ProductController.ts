import { Request, Response, NextFunction } from 'express';
import { ListProductsUseCase } from '@core/use-cases/ListProductsUseCase';
import { GetProductBySkuUseCase } from '@core/use-cases/GetProductBySkuUseCase';
import { CreateProductUseCase } from '@core/use-cases/CreateProductUseCase';
import { UpdateProductInput } from '@core/use-cases/catalog/UpdateProductUseCase';
import { UpdateProductUseCase } from '@core/use-cases/catalog/UpdateProductUseCase';
import { DeleteProductUseCase } from '@core/use-cases/catalog/DeleteProductUseCase';
import { UploadProductImageUseCase } from '@core/use-cases/catalog/UploadProductImageUseCase';
import { ProductResponseDTO } from '@core/dto/ProductDTO';
import { ProductData } from '@core/interfaces/IProductSKU';
import { ProductQueryOptions } from '@core/interfaces/IProductRepository';

function mapProductToDTO(product: any): ProductResponseDTO {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    basePrice: product.basePrice,
    description: product.description,
    originalPrice: product.originalPrice,
    badge: product.badge,
    specs: product.specs,
    featured: product.featured ?? false,
    inStock: product.inStock ?? true,
    imageName: product.imageName,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export class ProductController {
  constructor(
    private listProductsUseCase: ListProductsUseCase,
    private getProductBySkuUseCase: GetProductBySkuUseCase,
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
    private uploadImageUseCase?: UploadProductImageUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const queryOptions: ProductQueryOptions = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        category: req.query.category as any,
        featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
        search: req.query.search as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        sortBy: req.query.sortBy as any || 'createdAt',
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' || 'DESC'
      };

      const result = await this.listProductsUseCase.execute(queryOptions);
      res.json({
        ...result,
        data: result.data.map(mapProductToDTO)
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySku(req: Request, res: Response, next: NextFunction) {
    try {
      const sku = req.params.sku as string;
      const product = await this.getProductBySkuUseCase.execute(sku);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(mapProductToDTO(product));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const productData: ProductData = req.body;
      const product = await this.createProductUseCase.execute(productData);
      res.status(201).json(mapProductToDTO(product));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const sku = req.params.sku as string;
      const productData: UpdateProductInput = req.body;
      const product = await this.updateProductUseCase.execute(sku, productData);
      res.json(mapProductToDTO(product));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const sku = req.params.sku as string;
      await this.deleteProductUseCase.execute(sku);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const sku = req.params.sku as string;
      const file = req.file as Express.Multer.File;

      if (!file) {
        return res.status(400).json({ message: 'Nenhuma imagem enviada' });
      }

      const imageUrl = await this.uploadImageUseCase!.execute(sku, file);
      res.json({ imageUrl });
    } catch (error) {
      next(error);
    }
  }
}