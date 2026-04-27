import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@infrastructure/database/data-source';
import { Product } from '@core/domain/Product';
import { ProductVariant } from '@core/domain/ProductVariant';
import { User } from '@core/domain/User';
import { Supplier } from '@core/domain/Supplier';
import { Customer } from '@core/domain/Customer';

const adminRouter = Router();

interface DashboardMetrics {
  totalProducts: number;
  totalVariants: number;
  totalUsers: number;
  totalSuppliers: number;
  totalCustomers: number;
  lowStockProducts: number;
  totalRevenue: number;
  topProducts: Array<{ name: string; totalSold: number }>;
}

adminRouter.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const variantRepo = AppDataSource.getRepository(ProductVariant);
    const userRepo = AppDataSource.getRepository(User);
    const supplierRepo = AppDataSource.getRepository(Supplier);
    const customerRepo = AppDataSource.getRepository(Customer);

    const [
      totalProducts,
      totalVariants,
      totalUsers,
      totalSuppliers,
      totalCustomers,
      lowStockProducts
    ] = await Promise.all([
      productRepo.count(),
      variantRepo.count(),
      userRepo.count(),
      supplierRepo.count(),
      customerRepo.count(),
      variantRepo
        .createQueryBuilder('variant')
        .where('variant.stock < :threshold', { threshold: 10 })
        .getCount()
    ]);

    const metrics: DashboardMetrics = {
      totalProducts,
      totalVariants,
      totalUsers,
      totalSuppliers,
      totalCustomers,
      lowStockProducts,
      totalRevenue: 0,
      topProducts: []
    };

    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({ 
      take: 100,
      order: { createdAt: 'DESC' }
    });

    res.json({
      recentProducts: products.length,
      categories: [...new Set(products.map(p => p.category))].length
    });
  } catch (error) {
    next(error);
  }
});

export { adminRouter };