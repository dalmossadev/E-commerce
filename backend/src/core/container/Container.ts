import { ILeadRepository } from '@core/interfaces/ILeadRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { IUserRepository } from '@core/interfaces/IUserRepository';
import { ISupplierRepository } from '@core/interfaces/ISupplierRepository';
import { IOrderRepository } from '@core/interfaces/IOrderRepository';
import { IPurchaseRepository } from '@core/interfaces/IPurchaseRepository';
import { IAuditRepository } from '@core/interfaces/IAuditRepository';
import { TypeORMLeadRepository } from '@infrastructure/database/repositories/TypeORMLeadRepository';
import { TypeORMProductRepository } from '@infrastructure/database/repositories/TypeORMProductRepository';
import { TypeORMUserRepository } from '@infrastructure/database/repositories/TypeORMUserRepository';
import { TypeORMSupplierRepository } from '@infrastructure/database/repositories/TypeORMSupplierRepository';
import { TypeORMOrderRepository } from '@infrastructure/database/repositories/TypeORMOrderRepository';
import { TypeORMPurchaseRepository } from '@infrastructure/database/repositories/TypeORMPurchaseRepository';
import { TypeORMAuditRepository } from '@infrastructure/database/repositories/TypeORMAuditRepository';
import { CreateLeadUseCase, ListLeadsUseCase, GetLeadByIdUseCase, UpdateLeadStatusUseCase, DeleteLeadUseCase, CountLeadsUseCase } from '@core/use-cases/LeadUseCases';
import { ListProductsUseCase } from '@core/use-cases/ListProductsUseCase';
import { CreateProductUseCase } from '@core/use-cases/CreateProductUseCase';
import { GetProductBySkuUseCase } from '@core/use-cases/GetProductBySkuUseCase';
import { UpdateProductUseCase } from '@core/use-cases/catalog/UpdateProductUseCase';
import { DeleteProductUseCase } from '@core/use-cases/catalog/DeleteProductUseCase';
import { AuthUseCases } from '@core/use-cases/AuthUseCases';
import { CreateSupplierUseCase, ListSuppliersUseCase, GetSupplierByIdUseCase, UpdateSupplierUseCase, DeleteSupplierUseCase } from '@core/use-cases/SupplierUseCases';
import { CreateOrderUseCase, UpdateOrderStatusUseCase, CancelOrderUseCase, ListOrdersUseCase, GetOrderByIdUseCase } from '@core/use-cases/orders/OrderUseCases';
import { CreatePurchaseOrderUseCase, UpdatePurchaseStatusUseCase } from '@core/use-cases/procurement/CreatePurchaseOrderUseCase';
import { ReceiveInventoryUseCase } from '@core/use-cases/procurement/ReceiveInventoryUseCase';
import { ListPurchasesUseCase, GetPurchaseByIdUseCase, DeletePurchaseUseCase } from '@core/use-cases/procurement/ListPurchasesUseCase';
import { RefreshTokenUseCase } from '@core/use-cases/auth/RefreshTokenUseCase';
import { SkuService } from '@core/domain/services/SkuService';
import { DiscountService } from '@core/domain/services/DiscountService';
import { authService } from '@infrastructure/auth/AuthService';
import { AppDataSource } from '@infrastructure/database/data-source';
import { AuditLogModel } from '@infrastructure/database/models/AuditLogModel';

type Constructor<T = any> = new (...args: any[]) => T;

interface Provider<T> {
  get(): T;
}

class InstanceProvider<T> implements Provider<T> {
  private instance: T | null = null;
  private factory: () => T;

  constructor(private token: string, factory: () => T) {
    this.factory = factory;
    Container.register(this.token, this);
  }

  get(): T {
    if (!this.instance) {
      this.instance = this.factory();
    }
    return this.instance;
  }
}

class SingletonProvider<T> implements Provider<T> {
  private instance: T | null = null;
  private factory: () => T;

  constructor(private token: string, factory: () => T) {
    this.factory = factory;
  }

  get(): T {
    if (!this.instance) {
      this.instance = this.factory();
    }
    return this.instance;
  }
}

export class Container {
  private static providers = new Map<string, Provider<any>>();
  private static singletons = new Map<string, Provider<any>>();

  static register<T>(token: string, provider: Provider<T>): void {
    this.providers.set(token, provider);
  }

  static registerSingleton<T>(token: string, factory: () => T): void {
    const provider = new SingletonProvider(token, factory);
    this.singletons.set(token, provider);
  }

  static resolve<T>(token: string): T {
    const singleton = this.singletons.get(token);
    if (singleton) {
      return singleton.get();
    }

    const provider = this.providers.get(token);
    if (provider) {
      return provider.get();
    }

    throw new Error(`No provider found for token: ${token}`);
  }

  static has(token: string): boolean {
    return this.providers.has(token) || this.singletons.has(token);
  }

  static clear(): void {
    this.providers.clear();
    this.singletons.clear();
  }
}

export const productRepositoryToken = 'IProductRepository';
export const userRepositoryToken = 'IUserRepository';
export const supplierRepositoryToken = 'ISupplierRepository';
export const leadRepositoryToken = 'ILeadRepository';
export const orderRepositoryToken = 'IOrderRepository';
export const purchaseRepositoryToken = 'IPurchaseRepository';
export const auditRepositoryToken = 'IAuditRepository';
export const skuServiceToken = 'SkuService';
export const authServiceToken = 'AuthService';
export const discountServiceToken = 'DiscountService';

Container.registerSingleton(productRepositoryToken, () => new TypeORMProductRepository());
Container.registerSingleton(userRepositoryToken, () => new TypeORMUserRepository());
Container.registerSingleton(supplierRepositoryToken, () => new TypeORMSupplierRepository());
Container.registerSingleton(leadRepositoryToken, () => new TypeORMLeadRepository());
Container.registerSingleton(orderRepositoryToken, () => new TypeORMOrderRepository());
Container.registerSingleton(purchaseRepositoryToken, () => new TypeORMPurchaseRepository());
Container.registerSingleton(auditRepositoryToken, () => new TypeORMAuditRepository(AppDataSource.getRepository(AuditLogModel)));
Container.registerSingleton(skuServiceToken, () => new SkuService());
Container.registerSingleton(authServiceToken, () => authService);
Container.registerSingleton(discountServiceToken, () => new DiscountService(Container.resolve<IAuditRepository>(auditRepositoryToken)));

Container.registerSingleton('ListProductsUseCase', () => new ListProductsUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('CreateProductUseCase', () => new CreateProductUseCase(Container.resolve(productRepositoryToken), Container.resolve(skuServiceToken)));
Container.registerSingleton('GetProductBySkuUseCase', () => new GetProductBySkuUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('UpdateProductUseCase', () => new UpdateProductUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('DeleteProductUseCase', () => new DeleteProductUseCase(
  Container.resolve(productRepositoryToken),
  Container.resolve(orderRepositoryToken)
));

Container.registerSingleton('CreateLeadUseCase', () => new CreateLeadUseCase(
  Container.resolve(leadRepositoryToken),
  Container.resolve(productRepositoryToken)
));
Container.registerSingleton('ListLeadsUseCase', () => new ListLeadsUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('GetLeadByIdUseCase', () => new GetLeadByIdUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('UpdateLeadStatusUseCase', () => new UpdateLeadStatusUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('DeleteLeadUseCase', () => new DeleteLeadUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('CountLeadsUseCase', () => new CountLeadsUseCase(Container.resolve(leadRepositoryToken)));

Container.registerSingleton('AuthUseCases', () => new AuthUseCases(
  Container.resolve(userRepositoryToken),
  Container.resolve(authServiceToken)
));

Container.registerSingleton('RefreshTokenUseCase', () => new RefreshTokenUseCase(
  Container.resolve(userRepositoryToken),
  Container.resolve(authServiceToken)
));

Container.registerSingleton('CreateSupplierUseCase', () => new CreateSupplierUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('ListSuppliersUseCase', () => new ListSuppliersUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('GetSupplierByIdUseCase', () => new GetSupplierByIdUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('UpdateSupplierUseCase', () => new UpdateSupplierUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('DeleteSupplierUseCase', () => new DeleteSupplierUseCase(Container.resolve(supplierRepositoryToken)));

Container.registerSingleton('CreateOrderUseCase', () => new CreateOrderUseCase(
  Container.resolve(orderRepositoryToken),
  Container.resolve(productRepositoryToken),
  Container.resolve(discountServiceToken)
));
Container.registerSingleton('UpdateOrderStatusUseCase', () => new UpdateOrderStatusUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('CancelOrderUseCase', () => new CancelOrderUseCase(
  Container.resolve(orderRepositoryToken),
  Container.resolve(productRepositoryToken)
));
Container.registerSingleton('ListOrdersUseCase', () => new ListOrdersUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('GetOrderByIdUseCase', () => new GetOrderByIdUseCase(Container.resolve(orderRepositoryToken)));

Container.registerSingleton('CreatePurchaseUseCase', () => new CreatePurchaseOrderUseCase(
  Container.resolve(purchaseRepositoryToken),
  Container.resolve(productRepositoryToken)
));
Container.registerSingleton('ListPurchasesUseCase', () => new ListPurchasesUseCase(Container.resolve(purchaseRepositoryToken)));
Container.registerSingleton('GetPurchaseByIdUseCase', () => new GetPurchaseByIdUseCase(Container.resolve(purchaseRepositoryToken)));
Container.registerSingleton('UpdatePurchaseStatusUseCase', () => new UpdatePurchaseStatusUseCase(Container.resolve(purchaseRepositoryToken)));
Container.registerSingleton('ReceiveInventoryUseCase', () => new ReceiveInventoryUseCase(
  Container.resolve(purchaseRepositoryToken),
  Container.resolve(productRepositoryToken)
));
Container.registerSingleton('DeletePurchaseUseCase', () => new DeletePurchaseUseCase(Container.resolve(purchaseRepositoryToken)));

export const container = {
  leadRepository: () => Container.resolve<ILeadRepository>(leadRepositoryToken),
  productRepository: () => Container.resolve<IProductRepository>(productRepositoryToken),
  userRepository: () => Container.resolve<IUserRepository>(userRepositoryToken),
  supplierRepository: () => Container.resolve<ISupplierRepository>(supplierRepositoryToken),
  orderRepository: () => Container.resolve<IOrderRepository>(orderRepositoryToken),
  purchaseRepository: () => Container.resolve<IPurchaseRepository>(purchaseRepositoryToken),
  auditRepository: () => Container.resolve<IAuditRepository>(auditRepositoryToken),
  skuService: () => Container.resolve<SkuService>(skuServiceToken),
  discountService: () => Container.resolve<DiscountService>(discountServiceToken),
  
  createLeadUseCase: () => Container.resolve<CreateLeadUseCase>('CreateLeadUseCase'),
  listLeadsUseCase: () => Container.resolve<ListLeadsUseCase>('ListLeadsUseCase'),
  getLeadByIdUseCase: () => Container.resolve<GetLeadByIdUseCase>('GetLeadByIdUseCase'),
  updateLeadStatusUseCase: () => Container.resolve<UpdateLeadStatusUseCase>('UpdateLeadStatusUseCase'),
  deleteLeadUseCase: () => Container.resolve<DeleteLeadUseCase>('DeleteLeadUseCase'),
  countLeadsUseCase: () => Container.resolve<CountLeadsUseCase>('CountLeadsUseCase'),
  
  listProductsUseCase: () => Container.resolve<ListProductsUseCase>('ListProductsUseCase'),
  createProductUseCase: () => Container.resolve<CreateProductUseCase>('CreateProductUseCase'),
  getProductBySkuUseCase: () => Container.resolve<GetProductBySkuUseCase>('GetProductBySkuUseCase'),
  updateProductUseCase: () => Container.resolve<UpdateProductUseCase>('UpdateProductUseCase'),
  deleteProductUseCase: () => Container.resolve<DeleteProductUseCase>('DeleteProductUseCase'),
  
  authUseCases: () => Container.resolve<AuthUseCases>('AuthUseCases'),
  refreshTokenUseCase: () => Container.resolve<RefreshTokenUseCase>('RefreshTokenUseCase'),
  
  createSupplierUseCase: () => Container.resolve<CreateSupplierUseCase>('CreateSupplierUseCase'),
  listSuppliersUseCase: () => Container.resolve<ListSuppliersUseCase>('ListSuppliersUseCase'),
  getSupplierByIdUseCase: () => Container.resolve<GetSupplierByIdUseCase>('GetSupplierByIdUseCase'),
  updateSupplierUseCase: () => Container.resolve<UpdateSupplierUseCase>('UpdateSupplierUseCase'),
  deleteSupplierUseCase: () => Container.resolve<DeleteSupplierUseCase>('DeleteSupplierUseCase'),
  
  createOrderUseCase: () => Container.resolve<CreateOrderUseCase>('CreateOrderUseCase'),
  updateOrderStatusUseCase: () => Container.resolve<UpdateOrderStatusUseCase>('UpdateOrderStatusUseCase'),
  cancelOrderUseCase: () => Container.resolve<CancelOrderUseCase>('CancelOrderUseCase'),
  listOrdersUseCase: () => Container.resolve<ListOrdersUseCase>('ListOrdersUseCase'),
  getOrderByIdUseCase: () => Container.resolve<GetOrderByIdUseCase>('GetOrderByIdUseCase'),

  createPurchaseUseCase: () => Container.resolve<CreatePurchaseOrderUseCase>('CreatePurchaseUseCase'),
  listPurchasesUseCase: () => Container.resolve<ListPurchasesUseCase>('ListPurchasesUseCase'),
  getPurchaseByIdUseCase: () => Container.resolve<GetPurchaseByIdUseCase>('GetPurchaseByIdUseCase'),
  updatePurchaseStatusUseCase: () => Container.resolve<UpdatePurchaseStatusUseCase>('UpdatePurchaseStatusUseCase'),
  receiveInventoryUseCase: () => Container.resolve<ReceiveInventoryUseCase>('ReceiveInventoryUseCase'),
  deletePurchaseUseCase: () => Container.resolve<DeletePurchaseUseCase>('DeletePurchaseUseCase'),
};