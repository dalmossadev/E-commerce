import { ILeadRepository } from '@core/interfaces/ILeadRepository';
import { IProductRepository } from '@core/interfaces/IProductRepository';
import { IUserRepository } from '@core/interfaces/IUserRepository';
import { ISupplierRepository } from '@core/interfaces/ISupplierRepository';
import { IOrderRepository } from '@core/interfaces/IOrderRepository';
import { IPurchaseRepository } from '@core/interfaces/IPurchaseRepository';
import { IAuditRepository } from '@core/interfaces/IAuditRepository';
import { ICampaignRepository } from '@core/interfaces/ICampaignRepository';
import { ICustomerRepository } from '@core/interfaces/ICustomerRepository';
import { ISettingsRepository } from '@core/interfaces/ISettingsRepository';
import { IWishlistRepository } from '@core/interfaces/IWishlistRepository';
import { TypeORMLeadRepository } from '@infrastructure/database/repositories/TypeORMLeadRepository';
import { TypeORMProductRepository } from '@infrastructure/database/repositories/TypeORMProductRepository';
import { TypeORMUserRepository } from '@infrastructure/database/repositories/TypeORMUserRepository';
import { TypeORMSupplierRepository } from '@infrastructure/database/repositories/TypeORMSupplierRepository';
import { TypeORMOrderRepository } from '@infrastructure/database/repositories/TypeORMOrderRepository';
import { TypeORMPurchaseRepository } from '@infrastructure/database/repositories/TypeORMPurchaseRepository';
import { TypeORMAuditRepository } from '@infrastructure/database/repositories/TypeORMAuditRepository';
import { TypeORMCampaignRepository } from '@infrastructure/database/repositories/TypeORMCampaignRepository';
import { TypeORMCustomerRepository } from '@infrastructure/database/repositories/TypeORMCustomerRepository';
import { TypeORMSettingsRepository } from '@infrastructure/database/repositories/TypeORMSettingsRepository';
import { TypeORMWishlistRepository } from '@infrastructure/database/repositories/TypeORMWishlistRepository';
import { CreateLeadUseCase, ListLeadsUseCase, GetLeadByIdUseCase, UpdateLeadStatusUseCase, DeleteLeadUseCase, CountLeadsUseCase } from '@core/use-cases/LeadUseCases';
import { ListProductsUseCase } from '@core/use-cases/ListProductsUseCase';
import { CreateProductUseCase } from '@core/use-cases/CreateProductUseCase';
import { GetProductBySkuUseCase } from '@core/use-cases/GetProductBySkuUseCase';
import { UpdateProductUseCase } from '@core/use-cases/catalog/UpdateProductUseCase';
import { DeleteProductUseCase } from '@core/use-cases/catalog/DeleteProductUseCase';
import { AuthUseCases } from '@core/use-cases/AuthUseCases';
import { CreateSupplierUseCase, ListSuppliersUseCase, GetSupplierByIdUseCase, UpdateSupplierUseCase, DeleteSupplierUseCase } from '@core/use-cases/SupplierUseCases';
import { CreateOrderUseCase, UpdateOrderStatusUseCase, CancelOrderUseCase, ListOrdersUseCase, GetOrderByIdUseCase } from '@core/use-cases/orders/OrderUseCases';
import { ConfirmPaymentUseCase } from '@core/use-cases/orders/ConfirmPaymentUseCase';
import { GetOrderPixUseCase } from '@core/use-cases/orders/GetOrderPixUseCase';
import { GeneratePaymentQRCodeUseCase } from '@core/use-cases/payment/GeneratePaymentQRCodeUseCase';
import { CreatePurchaseOrderUseCase, UpdatePurchaseStatusUseCase } from '@core/use-cases/procurement/CreatePurchaseOrderUseCase';
import { ReceiveInventoryUseCase } from '@core/use-cases/procurement/ReceiveInventoryUseCase';
import { ListPurchasesUseCase, GetPurchaseByIdUseCase, DeletePurchaseUseCase } from '@core/use-cases/procurement/ListPurchasesUseCase';
import { RefreshTokenUseCase } from '@core/use-cases/auth/RefreshTokenUseCase';
import { UploadProductImageUseCase } from '@core/use-cases/catalog/UploadProductImageUseCase';
import { CreateCampaignUseCase, ListCampaignsUseCase, GetCampaignByIdUseCase, GetCampaignBySlugUseCase, UpdateCampaignUseCase, DeleteCampaignUseCase } from '@core/use-cases/campaign/CampaignUseCases';
import { CreateCustomerUseCase, ListCustomersUseCase, GetCustomerByIdUseCase, UpdateCustomerUseCase, DeleteCustomerUseCase } from '@core/use-cases/customers/CustomerUseCases';
import { GetSettingByKeyUseCase, ListSettingsUseCase, CreateSettingsUseCase, UpdateSettingsUseCase, DeleteSettingsUseCase } from '@core/use-cases/settings/SettingsUseCases';
import { GetSettingsUseCase } from '@core/use-cases/settings/GetSettingsUseCase';
import { GetSiteInfoUseCase, UpdateSiteInfoUseCase } from '@core/use-cases/settings/SiteInfoUseCases';
import { GetVariantHistoryBySkuUseCase, GetAllVariantHistoryUseCase } from '@core/use-cases/product-history/VariantHistoryUseCases';
import { GetProductsByRegionUseCase } from '@core/use-cases/product/GetProductsByRegionUseCase';
import { AddProductToWishlistUseCase, RemoveProductFromWishlistUseCase, GetUserWishlistUseCase } from '@core/use-cases/wishlist/WishlistUseCases';
import { GetFinancialDashboardUseCase } from '@core/use-cases/financial/GetFinancialDashboardUseCase';
import { SkuService } from '@core/domain/services/SkuService';
import { DiscountService } from '@core/domain/services/DiscountService';
import { authService } from '@infrastructure/auth/AuthService';
import { AppDataSource } from '@infrastructure/database/data-source';
import { AuditLogModel } from '@infrastructure/database/models/AuditLogModel';
import { TypeORMPaymentRepository } from '@infrastructure/database/repositories/TypeORMPaymentRepository';
import { QRCodeService } from '@infrastructure/services/QRCodeService';
import { IPaymentRepository } from '@core/interfaces/IPaymentRepository';
import { IQRCodeService } from '@core/interfaces/IQRCodeService';
import { IPaymentProvider } from '@core/interfaces/IPaymentProvider';
import { InfinitePayService } from '@infrastructure/services/InfinitePayService';
import { IFinancialTransactionRepository } from '@core/interfaces/IFinancialTransactionRepository';
import { TypeORMFinancialTransactionRepository } from '@infrastructure/database/repositories/TypeORMFinancialTransactionRepository';

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
export const campaignRepositoryToken = 'ICampaignRepository';
export const customerRepositoryToken = 'ICustomerRepository';
export const settingsRepositoryToken = 'ISettingsRepository';
export const wishlistRepositoryToken = 'IWishlistRepository';
export const skuServiceToken = 'SkuService';
export const authServiceToken = 'AuthService';
export const discountServiceToken = 'DiscountService';
export const paymentRepositoryToken = 'IPaymentRepository';
export const qrCodeServiceToken = 'IQRCodeService';
export const paymentProviderToken = 'IPaymentProvider';
export const financialTransactionRepositoryToken = 'IFinancialTransactionRepository';

Container.registerSingleton(productRepositoryToken, () => new TypeORMProductRepository());
Container.registerSingleton(userRepositoryToken, () => new TypeORMUserRepository());
Container.registerSingleton(supplierRepositoryToken, () => new TypeORMSupplierRepository());
Container.registerSingleton(leadRepositoryToken, () => new TypeORMLeadRepository());
Container.registerSingleton(orderRepositoryToken, () => new TypeORMOrderRepository());
Container.registerSingleton(purchaseRepositoryToken, () => new TypeORMPurchaseRepository());
Container.registerSingleton(auditRepositoryToken, () => new TypeORMAuditRepository(AppDataSource.getRepository(AuditLogModel)));
Container.registerSingleton(campaignRepositoryToken, () => new TypeORMCampaignRepository());
Container.registerSingleton(customerRepositoryToken, () => new TypeORMCustomerRepository());
Container.registerSingleton(settingsRepositoryToken, () => new TypeORMSettingsRepository());
Container.registerSingleton(wishlistRepositoryToken, () => new TypeORMWishlistRepository());
Container.registerSingleton(skuServiceToken, () => new SkuService());
Container.registerSingleton(authServiceToken, () => authService);
Container.registerSingleton(discountServiceToken, () => new DiscountService(Container.resolve<IAuditRepository>(auditRepositoryToken)));
Container.registerSingleton(paymentRepositoryToken, () => new TypeORMPaymentRepository());
Container.registerSingleton(qrCodeServiceToken, () => new QRCodeService());
Container.registerSingleton(paymentProviderToken, () => new InfinitePayService());
Container.registerSingleton(financialTransactionRepositoryToken, () => new TypeORMFinancialTransactionRepository());

Container.registerSingleton('ListProductsUseCase', () => new ListProductsUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('CreateProductUseCase', () => new CreateProductUseCase(Container.resolve(productRepositoryToken), Container.resolve(skuServiceToken)));
Container.registerSingleton('GetProductBySkuUseCase', () => new GetProductBySkuUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('UpdateProductUseCase', () => new UpdateProductUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('DeleteProductUseCase', () => new DeleteProductUseCase(
  Container.resolve(productRepositoryToken),
  Container.resolve(orderRepositoryToken)
));

Container.registerSingleton('UploadProductImageUseCase', () => new UploadProductImageUseCase(
  Container.resolve(productRepositoryToken)
));

Container.registerSingleton('CreateLeadUseCase', () => new CreateLeadUseCase(
  Container.resolve(leadRepositoryToken),
  Container.resolve(productRepositoryToken),
  Container.resolve(userRepositoryToken),
  Container.resolve<AddProductToWishlistUseCase>('AddProductToWishlistUseCase')
));
Container.registerSingleton('ListLeadsUseCase', () => new ListLeadsUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('GetLeadByIdUseCase', () => new GetLeadByIdUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('UpdateLeadStatusUseCase', () => new UpdateLeadStatusUseCase(
  Container.resolve(leadRepositoryToken),
  Container.resolve(auditRepositoryToken)
));
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
  Container.resolve(discountServiceToken),
  Container.resolve(paymentProviderToken)
));
Container.registerSingleton('UpdateOrderStatusUseCase', () => new UpdateOrderStatusUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('CancelOrderUseCase', () => new CancelOrderUseCase(
  Container.resolve(orderRepositoryToken),
  Container.resolve(productRepositoryToken)
));
Container.registerSingleton('ListOrdersUseCase', () => new ListOrdersUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('GetOrderByIdUseCase', () => new GetOrderByIdUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('ConfirmPaymentUseCase', () => new ConfirmPaymentUseCase(
  Container.resolve(orderRepositoryToken),
  Container.resolve(auditRepositoryToken),
  Container.resolve(financialTransactionRepositoryToken)
));
Container.registerSingleton('GetOrderPixUseCase', () => new GetOrderPixUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('GeneratePaymentQRCodeUseCase', () => new GeneratePaymentQRCodeUseCase(
  Container.resolve(qrCodeServiceToken),
  Container.resolve(paymentRepositoryToken)
));

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

Container.registerSingleton('CreateCampaignUseCase', () => new CreateCampaignUseCase(Container.resolve(campaignRepositoryToken)));
Container.registerSingleton('ListCampaignsUseCase', () => new ListCampaignsUseCase(Container.resolve(campaignRepositoryToken)));
Container.registerSingleton('GetCampaignByIdUseCase', () => new GetCampaignByIdUseCase(Container.resolve(campaignRepositoryToken)));
Container.registerSingleton('GetCampaignBySlugUseCase', () => new GetCampaignBySlugUseCase(Container.resolve(campaignRepositoryToken)));
Container.registerSingleton('UpdateCampaignUseCase', () => new UpdateCampaignUseCase(Container.resolve(campaignRepositoryToken)));
Container.registerSingleton('DeleteCampaignUseCase', () => new DeleteCampaignUseCase(Container.resolve(campaignRepositoryToken)));

Container.registerSingleton('CreateCustomerUseCase', () => new CreateCustomerUseCase(Container.resolve(customerRepositoryToken)));
Container.registerSingleton('ListCustomersUseCase', () => new ListCustomersUseCase(Container.resolve(customerRepositoryToken)));
Container.registerSingleton('GetCustomerByIdUseCase', () => new GetCustomerByIdUseCase(Container.resolve(customerRepositoryToken)));
Container.registerSingleton('UpdateCustomerUseCase', () => new UpdateCustomerUseCase(Container.resolve(customerRepositoryToken)));
Container.registerSingleton('DeleteCustomerUseCase', () => new DeleteCustomerUseCase(Container.resolve(customerRepositoryToken)));

Container.registerSingleton('GetSettingByKeyUseCase', () => new GetSettingByKeyUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('GetSettingsUseCase', () => new GetSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('ListSettingsUseCase', () => new ListSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('CreateSettingsUseCase', () => new CreateSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('UpdateSettingsUseCase', () => new UpdateSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('DeleteSettingsUseCase', () => new DeleteSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('GetSiteInfoUseCase', () => new GetSiteInfoUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('UpdateSiteInfoUseCase', () => new UpdateSiteInfoUseCase(Container.resolve(settingsRepositoryToken)));

Container.registerSingleton('GetVariantHistoryBySkuUseCase', () => new GetVariantHistoryBySkuUseCase());
Container.registerSingleton('GetAllVariantHistoryUseCase', () => new GetAllVariantHistoryUseCase());
Container.registerSingleton('GetProductsByRegionUseCase', () => new GetProductsByRegionUseCase(Container.resolve(productRepositoryToken)));

Container.registerSingleton('AddProductToWishlistUseCase', () => new AddProductToWishlistUseCase(
  Container.resolve<IWishlistRepository>(wishlistRepositoryToken),
  Container.resolve<IProductRepository>(productRepositoryToken),
  Container.resolve<IUserRepository>(userRepositoryToken)
));
Container.registerSingleton('RemoveProductFromWishlistUseCase', () => new RemoveProductFromWishlistUseCase(
  Container.resolve<IWishlistRepository>(wishlistRepositoryToken)
));
Container.registerSingleton('GetUserWishlistUseCase', () => new GetUserWishlistUseCase(
  Container.resolve<IWishlistRepository>(wishlistRepositoryToken)
));
Container.registerSingleton('GetFinancialDashboardUseCase', () => new GetFinancialDashboardUseCase(
  Container.resolve<IFinancialTransactionRepository>(financialTransactionRepositoryToken)
));

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
  addProductToWishlistUseCase: () => Container.resolve<AddProductToWishlistUseCase>('AddProductToWishlistUseCase'),
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
  uploadProductImageUseCase: () => Container.resolve<UploadProductImageUseCase>('UploadProductImageUseCase'),
  
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
  confirmPaymentUseCase: () => Container.resolve<ConfirmPaymentUseCase>('ConfirmPaymentUseCase'),
  getOrderPixUseCase: () => Container.resolve<GetOrderPixUseCase>('GetOrderPixUseCase'),
  generatePaymentQRCodeUseCase: () => Container.resolve<GeneratePaymentQRCodeUseCase>('GeneratePaymentQRCodeUseCase'),

  createPurchaseUseCase: () => Container.resolve<CreatePurchaseOrderUseCase>('CreatePurchaseUseCase'),
  listPurchasesUseCase: () => Container.resolve<ListPurchasesUseCase>('ListPurchasesUseCase'),
  getPurchaseByIdUseCase: () => Container.resolve<GetPurchaseByIdUseCase>('GetPurchaseByIdUseCase'),
  updatePurchaseStatusUseCase: () => Container.resolve<UpdatePurchaseStatusUseCase>('UpdatePurchaseStatusUseCase'),
  receiveInventoryUseCase: () => Container.resolve<ReceiveInventoryUseCase>('ReceiveInventoryUseCase'),
  deletePurchaseUseCase: () => Container.resolve<DeletePurchaseUseCase>('DeletePurchaseUseCase'),

  campaignRepository: () => Container.resolve<ICampaignRepository>(campaignRepositoryToken),
  customerRepository: () => Container.resolve<ICustomerRepository>(customerRepositoryToken),
  settingsRepository: () => Container.resolve<ISettingsRepository>(settingsRepositoryToken),

  createCampaignUseCase: () => Container.resolve<CreateCampaignUseCase>('CreateCampaignUseCase'),
  listCampaignsUseCase: () => Container.resolve<ListCampaignsUseCase>('ListCampaignsUseCase'),
  getCampaignByIdUseCase: () => Container.resolve<GetCampaignByIdUseCase>('GetCampaignByIdUseCase'),
  getCampaignBySlugUseCase: () => Container.resolve<GetCampaignBySlugUseCase>('GetCampaignBySlugUseCase'),
  updateCampaignUseCase: () => Container.resolve<UpdateCampaignUseCase>('UpdateCampaignUseCase'),
  deleteCampaignUseCase: () => Container.resolve<DeleteCampaignUseCase>('DeleteCampaignUseCase'),

  createCustomerUseCase: () => Container.resolve<CreateCustomerUseCase>('CreateCustomerUseCase'),
  listCustomersUseCase: () => Container.resolve<ListCustomersUseCase>('ListCustomersUseCase'),
  getCustomerByIdUseCase: () => Container.resolve<GetCustomerByIdUseCase>('GetCustomerByIdUseCase'),
  updateCustomerUseCase: () => Container.resolve<UpdateCustomerUseCase>('UpdateCustomerUseCase'),
  deleteCustomerUseCase: () => Container.resolve<DeleteCustomerUseCase>('DeleteCustomerUseCase'),

  getSettingByKeyUseCase: () => Container.resolve<GetSettingByKeyUseCase>('GetSettingByKeyUseCase'),
  getSettingsUseCase: () => Container.resolve<GetSettingsUseCase>('GetSettingsUseCase'),
  listSettingsUseCase: () => Container.resolve<ListSettingsUseCase>('ListSettingsUseCase'),
  createSettingsUseCase: () => Container.resolve<CreateSettingsUseCase>('CreateSettingsUseCase'),
  updateSettingsUseCase: () => Container.resolve<UpdateSettingsUseCase>('UpdateSettingsUseCase'),
  deleteSettingsUseCase: () => Container.resolve<DeleteSettingsUseCase>('DeleteSettingsUseCase'),
  getSiteInfoUseCase: () => Container.resolve<GetSiteInfoUseCase>('GetSiteInfoUseCase'),
  updateSiteInfoUseCase: () => Container.resolve<UpdateSiteInfoUseCase>('UpdateSiteInfoUseCase'),

  getVariantHistoryBySkuUseCase: () => Container.resolve<GetVariantHistoryBySkuUseCase>('GetVariantHistoryBySkuUseCase'),
  getAllVariantHistoryUseCase: () => Container.resolve<GetAllVariantHistoryUseCase>('GetAllVariantHistoryUseCase'),

  wishlistRepository: () => Container.resolve<IWishlistRepository>(wishlistRepositoryToken),
  addToWishlistUseCase: () => Container.resolve<AddProductToWishlistUseCase>('AddProductToWishlistUseCase'),
  removeFromWishlistUseCase: () => Container.resolve<RemoveProductFromWishlistUseCase>('RemoveProductFromWishlistUseCase'),
  getUserWishlistUseCase: () => Container.resolve<GetUserWishlistUseCase>('GetUserWishlistUseCase'),
  
  getFinancialDashboardUseCase: () => Container.resolve<GetFinancialDashboardUseCase>('GetFinancialDashboardUseCase'),
};