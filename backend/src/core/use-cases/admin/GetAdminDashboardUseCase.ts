import { IProductRepository } from '../../interfaces/IProductRepository';
import { IUserRepository } from '../../interfaces/IUserRepository';
import { ISupplierRepository } from '../../interfaces/ISupplierRepository';
import { ICustomerRepository } from '../../interfaces/ICustomerRepository';
import { IOrderRepository } from '../../interfaces/IOrderRepository';

export interface AdminDashboardMetrics {
  totalProducts: number;
  totalVariants: number;
  totalUsers: number;
  totalSuppliers: number;
  totalCustomers: number;
  lowStockProducts: number;
  totalRevenue: number;
  topProducts: Array<{ name: string; totalSold: number }>;
}

export class GetAdminDashboardUseCase {
  constructor(
    private productRepository: IProductRepository,
    private userRepository: IUserRepository,
    private supplierRepository: ISupplierRepository,
    private customerRepository: ICustomerRepository,
    private orderRepository: IOrderRepository
  ) {}

  async execute(): Promise<AdminDashboardMetrics> {
    const [
      totalProducts,
      totalUsers,
      totalSuppliers,
      totalCustomers,
      lowStockVariants
    ] = await Promise.all([
      this.productRepository.countAll(),
      this.userRepository.countAll(),
      this.supplierRepository.countAll(),
      this.customerRepository.countAll(),
      this.productRepository.countLowStockVariants(10)
    ]);

    // Note: totalVariants and other metrics could be added to repositories
    // For now, using available count methods.

    return {
      totalProducts,
      totalVariants: 0, // Placeholder if not easily available
      totalUsers,
      totalSuppliers,
      totalCustomers,
      lowStockProducts: lowStockVariants,
      totalRevenue: 0,
      topProducts: []
    };
  }
}
