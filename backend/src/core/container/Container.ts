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
import { ICategoryRepository } from '@core/interfaces/ICategoryRepository';
import { IVariantHistoryRepository } from '@core/interfaces/IVariantHistoryRepository';
import { IAddressRepository } from '@core/interfaces/IAddressRepository';
import { IPaymentRepository } from '@core/interfaces/IPaymentRepository';
import { IQRCodeService } from '@core/interfaces/IQRCodeService';
import { IPaymentProvider } from '@core/interfaces/IPaymentProvider';
import { IFinancialTransactionRepository } from '@core/interfaces/IFinancialTransactionRepository';
import { IBannerRepository } from '@core/interfaces/IBannerRepository';
import { ISiteConfigRepository } from '@core/interfaces/ISiteConfigRepository';
import { ICouponRepository } from '@core/interfaces/ICouponRepository';
import { IShippingRuleRepository } from '@core/interfaces/IShippingRuleRepository';

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
import { TypeORMCategoryRepository } from '@infrastructure/database/repositories/TypeORMCategoryRepository';
import { TypeORMAddressRepository } from '@infrastructure/database/repositories/TypeORMAddressRepository';
import { TypeORMPaymentRepository } from '@infrastructure/database/repositories/TypeORMPaymentRepository';
import { TypeORMFinancialTransactionRepository } from '@infrastructure/database/repositories/TypeORMFinancialTransactionRepository';
import { TypeORMVariantHistoryRepository } from '@infrastructure/database/repositories/TypeORMVariantHistoryRepository';
import { TypeORMBannerRepository } from '@infrastructure/database/repositories/TypeORMBannerRepository';
import { TypeORMSiteConfigRepository } from '@infrastructure/database/repositories/TypeORMSiteConfigRepository';
import { TypeORMShippingRuleRepository } from '@infrastructure/database/repositories/TypeORMShippingRuleRepository';
import { TypeORMCouponRepository } from '@infrastructure/database/repositories/TypeORMCouponRepository';

import { CreateLeadUseCase, LeadValidator, LeadFactory } from '@core/use-cases/lead/CreateLeadUseCase';
import { ListLeadsUseCase } from '@core/use-cases/lead/ListLeadsUseCase';
import { GetLeadByIdUseCase } from '@core/use-cases/lead/GetLeadByIdUseCase';
import { UpdateLeadStatusUseCase } from '@core/use-cases/lead/UpdateLeadStatusUseCase';
import { DeleteLeadUseCase } from '@core/use-cases/lead/DeleteLeadUseCase';
import { CountLeadsUseCase } from '@core/use-cases/lead/CountLeadsUseCase';

import { ListProductsUseCase } from '@core/use-cases/catalog/ListProductsUseCase';
import { CreateProductUseCase } from '@core/use-cases/catalog/CreateProductUseCase';
import { GetProductBySkuUseCase } from '@core/use-cases/catalog/GetProductBySkuUseCase';
import { UpdateProductUseCase } from '@core/use-cases/catalog/UpdateProductUseCase';
import { DeleteProductUseCase } from '@core/use-cases/catalog/DeleteProductUseCase';
import { UploadProductImageUseCase } from '@core/use-cases/catalog/UploadProductImageUseCase';

import { LoginUseCase } from '@core/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@core/use-cases/auth/RegisterUseCase';
import { RefreshTokenUseCase } from '@core/use-cases/auth/RefreshTokenUseCase';

import { CreateSupplierUseCase } from '@core/use-cases/supplier/CreateSupplierUseCase';
import { ListSuppliersUseCase } from '@core/use-cases/supplier/ListSuppliersUseCase';
import { GetSupplierByIdUseCase } from '@core/use-cases/supplier/GetSupplierByIdUseCase';
import { UpdateSupplierUseCase } from '@core/use-cases/supplier/UpdateSupplierUseCase';
import { DeleteSupplierUseCase } from '@core/use-cases/supplier/DeleteSupplierUseCase';

import { CreateCategoryUseCase } from '@core/use-cases/category/CreateCategoryUseCase';
import { ListCategoriesUseCase } from '@core/use-cases/category/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from '@core/use-cases/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '@core/use-cases/category/DeleteCategoryUseCase';

import { CreateOrderUseCase, OrderValidator, OrderFactory } from '@core/use-cases/orders/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '@core/use-cases/orders/UpdateOrderStatusUseCase';
import { CancelOrderUseCase } from '@core/use-cases/orders/CancelOrderUseCase';
import { ListOrdersUseCase } from '@core/use-cases/orders/ListOrdersUseCase';
import { GetOrderByIdUseCase } from '@core/use-cases/orders/GetOrderByIdUseCase';
import { ConfirmPaymentUseCase } from '@core/use-cases/orders/ConfirmPaymentUseCase';
import { GetOrderPixUseCase } from '@core/use-cases/orders/GetOrderPixUseCase';

import { GeneratePaymentQRCodeUseCase } from '@core/use-cases/payment/GeneratePaymentQRCodeUseCase';

import { CreatePurchaseOrderUseCase, PurchaseValidator, PurchaseFactory } from '@core/use-cases/procurement/CreatePurchaseOrderUseCase';
import { UpdatePurchaseStatusUseCase } from '@core/use-cases/procurement/UpdatePurchaseStatusUseCase';
import { ListPurchasesUseCase } from '@core/use-cases/procurement/ListPurchasesUseCase';
import { GetPurchaseByIdUseCase } from '@core/use-cases/procurement/GetPurchaseByIdUseCase';
import { DeletePurchaseUseCase } from '@core/use-cases/procurement/DeletePurchaseUseCase';
import { ReceiveInventoryUseCase } from '@core/use-cases/procurement/ReceiveInventoryUseCase';

import { CreateCampaignUseCase } from '@core/use-cases/campaign/CreateCampaignUseCase';
import { ListCampaignsUseCase } from '@core/use-cases/campaign/ListCampaignsUseCase';
import { GetCampaignByIdUseCase } from '@core/use-cases/campaign/GetCampaignByIdUseCase';
import { GetCampaignBySlugUseCase } from '@core/use-cases/campaign/GetCampaignBySlugUseCase';
import { UpdateCampaignUseCase } from '@core/use-cases/campaign/UpdateCampaignUseCase';
import { DeleteCampaignUseCase } from '@core/use-cases/campaign/DeleteCampaignUseCase';

import { CreateCustomerUseCase } from '@core/use-cases/customers/CreateCustomerUseCase';
import { ListCustomersUseCase } from '@core/use-cases/customers/ListCustomersUseCase';
import { GetCustomerByIdUseCase } from '@core/use-cases/customers/GetCustomerByIdUseCase';
import { UpdateCustomerUseCase } from '@core/use-cases/customers/UpdateCustomerUseCase';
import { DeleteCustomerUseCase } from '@core/use-cases/customers/DeleteCustomerUseCase';

import { GetSettingByKeyUseCase } from '@core/use-cases/settings/GetSettingByKeyUseCase';
import { GetSettingsByIdUseCase } from '@core/use-cases/settings/GetSettingsByIdUseCase';
import { ListSettingsUseCase } from '@core/use-cases/settings/ListSettingsUseCase';
import { CreateSettingsUseCase } from '@core/use-cases/settings/CreateSettingsUseCase';
import { UpdateSettingsUseCase } from '@core/use-cases/settings/UpdateSettingsUseCase';
import { DeleteSettingsUseCase } from '@core/use-cases/settings/DeleteSettingsUseCase';
import { GetSettingsUseCase } from '@core/use-cases/settings/GetSettingsUseCase';
import { GetSiteInfoUseCase } from '@core/use-cases/settings/GetSiteInfoUseCase';
import { UpdateSiteInfoUseCase } from '@core/use-cases/settings/UpdateSiteInfoUseCase';

import { GetVariantHistoryBySkuUseCase } from '@core/use-cases/product-history/GetVariantHistoryBySkuUseCase';
import { GetAllVariantHistoryUseCase } from '@core/use-cases/product-history/GetAllVariantHistoryUseCase';

import { GetProductsByRegionUseCase } from '@core/use-cases/product/GetProductsByRegionUseCase';

import { AddProductToWishlistUseCase } from '@core/use-cases/wishlist/AddProductToWishlistUseCase';
import { RemoveProductFromWishlistUseCase } from '@core/use-cases/wishlist/RemoveProductFromWishlistUseCase';
import { GetUserWishlistUseCase } from '@core/use-cases/wishlist/GetUserWishlistUseCase';

import { GetFinancialDashboardUseCase } from '@core/use-cases/financial/GetFinancialDashboardUseCase';

import { CreateAddressUseCase } from '@core/use-cases/address/CreateAddressUseCase';
import { UpdateAddressUseCase } from '@core/use-cases/address/UpdateAddressUseCase';
import { DeleteAddressUseCase } from '@core/use-cases/address/DeleteAddressUseCase';
import { ListAddressesByOwnerUseCase } from '@core/use-cases/address/ListAddressesByOwnerUseCase';
import { SetMainAddressUseCase } from '@core/use-cases/address/SetMainAddressUseCase';

import { ListBannersUseCase } from '@core/use-cases/banner/ListBannerUseCase';
import { ListInventoryUseCase } from '@core/use-cases/inventory/ListInventoryUseCase';
import { CalculateShippingUseCase } from '@core/use-cases/shipping/CalculateShippingUseCase';
import { ListShippingRulesUseCase } from '@core/use-cases/shipping/ListShippingRulesUseCase';
import { ValidateCouponUseCase } from '@core/use-cases/coupons/ValidateCouponUseCase';
import { ListCouponsUseCase } from '@core/use-cases/coupons/ListCouponsUseCase';
import { SaveCouponUseCase } from '@core/use-cases/coupons/SaveCouponUseCase';
import { SaveShippingRuleUseCase } from '@core/use-cases/shipping/SaveShippingRuleUseCase';
import { UpdateStockUseCase } from '@core/use-cases/inventory/UpdateStockUseCase';
import { CreateBannerUseCase } from '@core/use-cases/banner/CreateBannerUseCase';
import { UpdateBannerUseCase } from '@core/use-cases/banner/UpdateBannerUseCase';
import { DeleteBannerUseCase } from '@core/use-cases/banner/DeleteBannerUseCase';
import { UploadBannerImageUseCase } from '@core/use-cases/banner/UploadBannerImageUseCase';
import { GetSiteInfoUseCase as GetSiteInfoLegacyUseCase } from '@core/use-cases/site/GetSiteInfoUseCase';

import { CategoryController } from '@adapters/http/controllers/CategoryController';
import { LeadController } from '@adapters/http/controllers/LeadController';
import { SupplierController } from '@adapters/http/controllers/SupplierController';
import { CustomerController } from '@adapters/http/controllers/CustomerController';
import { CampaignController } from '@adapters/http/controllers/CampaignController';
import { OrderController } from '@adapters/http/controllers/OrderController';
import { AddressController } from '@adapters/http/controllers/AddressController';
import { ProductController } from '@adapters/http/controllers/ProductController';
import { SettingsController } from '@adapters/http/controllers/SettingsController';
import { WishlistController } from '@adapters/http/controllers/WishlistController';
import { PurchaseController } from '@adapters/http/controllers/PurchaseController';
import { ProductHistoryController } from '@adapters/http/controllers/ProductHistoryController';
import { FinancialController } from '@adapters/http/controllers/FinancialController';
import { PaymentController } from '@adapters/http/controllers/PaymentController';
import { BannerController } from '@adapters/http/controllers/banner-controller';
import { InventoryController } from '@adapters/http/controllers/InventoryController';
import { ShippingController } from '@adapters/http/controllers/ShippingController';
import { CouponController } from '@adapters/http/controllers/CouponController';
import { RegionController } from '@adapters/http/controllers/RegionController';
import { SiteConfigController } from '@adapters/http/controllers/SiteConfigController';
import { WebhookController } from '@adapters/http/controllers/WebhookController';

import { SkuService } from '@core/domain/services/SkuService';
import { DiscountService } from '@core/domain/services/DiscountService';
import { authService } from '@infrastructure/auth/AuthService';
import { AppDataSource } from '@infrastructure/database/data-source';
import { AuditLogModel } from '@infrastructure/database/models/AuditLogModel';
import { QRCodeService } from '@infrastructure/services/QRCodeService';
import { InfinitePayService } from '@infrastructure/services/InfinitePayService';

import { GetAdminDashboardUseCase } from '@core/use-cases/admin/GetAdminDashboardUseCase';
import { AdminController } from '@adapters/http/controllers/AdminController';

interface Provider<T> {
  get(): T;
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
  private static singletons = new Map<string, Provider<any>>();

  static registerSingleton<T>(token: string, factory: () => T): void {
    const provider = new SingletonProvider(token, factory);
    this.singletons.set(token, provider);
  }

  static resolve<T>(token: string): T {
    const singleton = this.singletons.get(token);
    if (singleton) {
      return singleton.get();
    }
    throw new Error(`No provider found for token: ${token}`);
  }
}

// Tokens
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
export const categoryRepositoryToken = 'ICategoryRepository';
export const addressRepositoryToken = 'IAddressRepository';
export const paymentRepositoryToken = 'IPaymentRepository';
export const financialTransactionRepositoryToken = 'IFinancialTransactionRepository';
export const variantHistoryRepositoryToken = 'IVariantHistoryRepository';
export const bannerRepositoryToken = 'IBannerRepository';
export const siteConfigRepositoryToken = 'ISiteConfigRepository';
export const skuServiceToken = 'SkuService';
export const authServiceToken = 'AuthService';
export const discountServiceToken = 'DiscountService';
export const qrCodeServiceToken = 'IQRCodeService';
export const paymentProviderToken = 'IPaymentProvider';

// Repositories & Services
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
Container.registerSingleton(categoryRepositoryToken, () => new TypeORMCategoryRepository());
Container.registerSingleton(addressRepositoryToken, () => new TypeORMAddressRepository());
Container.registerSingleton(paymentRepositoryToken, () => new TypeORMPaymentRepository());
Container.registerSingleton(financialTransactionRepositoryToken, () => new TypeORMFinancialTransactionRepository());
Container.registerSingleton(variantHistoryRepositoryToken, () => new TypeORMVariantHistoryRepository());
Container.registerSingleton(bannerRepositoryToken, () => new TypeORMBannerRepository());
Container.registerSingleton(siteConfigRepositoryToken, () => new TypeORMSiteConfigRepository());
Container.registerSingleton('IShippingRuleRepository', () => new TypeORMShippingRuleRepository());
Container.registerSingleton('ICouponRepository', () => new TypeORMCouponRepository());
Container.registerSingleton(skuServiceToken, () => new SkuService());
Container.registerSingleton(authServiceToken, () => authService);
Container.registerSingleton(discountServiceToken, () => new DiscountService(Container.resolve<IAuditRepository>(auditRepositoryToken)));
Container.registerSingleton(qrCodeServiceToken, () => new QRCodeService());
Container.registerSingleton(paymentProviderToken, () => new InfinitePayService());

// Use Cases
Container.registerSingleton('ListProductsUseCase', () => new ListProductsUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('CreateProductUseCase', () => new CreateProductUseCase(Container.resolve(productRepositoryToken), Container.resolve(skuServiceToken)));
Container.registerSingleton('GetProductBySkuUseCase', () => new GetProductBySkuUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('UpdateProductUseCase', () => new UpdateProductUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('DeleteProductUseCase', () => new DeleteProductUseCase(Container.resolve(productRepositoryToken), Container.resolve(orderRepositoryToken)));
Container.registerSingleton('UploadProductImageUseCase', () => new UploadProductImageUseCase(Container.resolve(productRepositoryToken)));

Container.registerSingleton('GetAdminDashboardUseCase', () => new GetAdminDashboardUseCase(
  Container.resolve(productRepositoryToken),
  Container.resolve(userRepositoryToken),
  Container.resolve(supplierRepositoryToken),
  Container.resolve(customerRepositoryToken),
  Container.resolve(orderRepositoryToken)
));

Container.registerSingleton('AdminController', () => new AdminController(
  Container.resolve('GetAdminDashboardUseCase')
));

Container.registerSingleton('LeadValidator', () => new LeadValidator());
Container.registerSingleton('LeadFactory', () => new LeadFactory());
Container.registerSingleton('CreateLeadUseCase', () => new CreateLeadUseCase(
  Container.resolve(leadRepositoryToken),
  Container.resolve('LeadValidator'),
  Container.resolve('LeadFactory'),
  Container.resolve(productRepositoryToken),
  Container.resolve(userRepositoryToken),
  Container.resolve('AddProductToWishlistUseCase')
));
Container.registerSingleton('ListLeadsUseCase', () => new ListLeadsUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('GetLeadByIdUseCase', () => new GetLeadByIdUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('UpdateLeadStatusUseCase', () => new UpdateLeadStatusUseCase(Container.resolve(leadRepositoryToken), Container.resolve(auditRepositoryToken)));
Container.registerSingleton('DeleteLeadUseCase', () => new DeleteLeadUseCase(Container.resolve(leadRepositoryToken)));
Container.registerSingleton('CountLeadsUseCase', () => new CountLeadsUseCase(Container.resolve(leadRepositoryToken)));

Container.registerSingleton('LoginUseCase', () => new LoginUseCase(Container.resolve(userRepositoryToken), Container.resolve(authServiceToken)));
Container.registerSingleton('RegisterUseCase', () => new RegisterUseCase(Container.resolve(userRepositoryToken), Container.resolve(authServiceToken)));
Container.registerSingleton('RefreshTokenUseCase', () => new RefreshTokenUseCase(Container.resolve(userRepositoryToken), Container.resolve(authServiceToken)));

Container.registerSingleton('CreateSupplierUseCase', () => new CreateSupplierUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('ListSuppliersUseCase', () => new ListSuppliersUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('GetSupplierByIdUseCase', () => new GetSupplierByIdUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('UpdateSupplierUseCase', () => new UpdateSupplierUseCase(Container.resolve(supplierRepositoryToken)));
Container.registerSingleton('DeleteSupplierUseCase', () => new DeleteSupplierUseCase(Container.resolve(supplierRepositoryToken)));

Container.registerSingleton('CreateCategoryUseCase', () => new CreateCategoryUseCase(Container.resolve(categoryRepositoryToken)));
Container.registerSingleton('ListCategoriesUseCase', () => new ListCategoriesUseCase(Container.resolve(categoryRepositoryToken)));
Container.registerSingleton('UpdateCategoryUseCase', () => new UpdateCategoryUseCase(Container.resolve(categoryRepositoryToken)));
Container.registerSingleton('DeleteCategoryUseCase', () => new DeleteCategoryUseCase(Container.resolve(categoryRepositoryToken)));

Container.registerSingleton('OrderValidator', () => new OrderValidator());
Container.registerSingleton('OrderFactory', () => new OrderFactory());
Container.registerSingleton('CreateOrderUseCase', () => new CreateOrderUseCase(
  Container.resolve(orderRepositoryToken),
  new OrderValidator(),
  new OrderFactory(),
  Container.resolve(productRepositoryToken),
  Container.resolve(discountServiceToken),
  Container.resolve(paymentProviderToken),
  Container.resolve('ICouponRepository'),
  Container.resolve('IShippingRuleRepository')
));
Container.registerSingleton('UpdateOrderStatusUseCase', () => new UpdateOrderStatusUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('CancelOrderUseCase', () => new CancelOrderUseCase(Container.resolve(orderRepositoryToken), Container.resolve(productRepositoryToken)));
Container.registerSingleton('ListOrdersUseCase', () => new ListOrdersUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('GetOrderByIdUseCase', () => new GetOrderByIdUseCase(Container.resolve(orderRepositoryToken)));
Container.registerSingleton('ConfirmPaymentUseCase', () => new ConfirmPaymentUseCase(Container.resolve(orderRepositoryToken), Container.resolve(auditRepositoryToken), Container.resolve(financialTransactionRepositoryToken)));
Container.registerSingleton('GetOrderPixUseCase', () => new GetOrderPixUseCase(Container.resolve(orderRepositoryToken)));

Container.registerSingleton('GeneratePaymentQRCodeUseCase', () => new GeneratePaymentQRCodeUseCase(Container.resolve(qrCodeServiceToken), Container.resolve(paymentRepositoryToken)));

Container.registerSingleton('PurchaseValidator', () => new PurchaseValidator());
Container.registerSingleton('PurchaseFactory', () => new PurchaseFactory());
Container.registerSingleton('CreatePurchaseUseCase', () => new CreatePurchaseOrderUseCase(Container.resolve(purchaseRepositoryToken), Container.resolve('PurchaseValidator'), Container.resolve('PurchaseFactory')));
Container.registerSingleton('UpdatePurchaseStatusUseCase', () => new UpdatePurchaseStatusUseCase(Container.resolve(purchaseRepositoryToken)));
Container.registerSingleton('ListPurchasesUseCase', () => new ListPurchasesUseCase(Container.resolve(purchaseRepositoryToken)));
Container.registerSingleton('GetPurchaseByIdUseCase', () => new GetPurchaseByIdUseCase(Container.resolve(purchaseRepositoryToken)));
Container.registerSingleton('DeletePurchaseUseCase', () => new DeletePurchaseUseCase(Container.resolve(purchaseRepositoryToken)));
Container.registerSingleton('ReceiveInventoryUseCase', () => new ReceiveInventoryUseCase(Container.resolve(purchaseRepositoryToken), Container.resolve(productRepositoryToken)));

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
Container.registerSingleton('GetSettingsByIdUseCase', () => new GetSettingsByIdUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('GetSettingsUseCase', () => new GetSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('ListSettingsUseCase', () => new ListSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('CreateSettingsUseCase', () => new CreateSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('UpdateSettingsUseCase', () => new UpdateSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('DeleteSettingsUseCase', () => new DeleteSettingsUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('GetSiteInfoUseCase', () => new GetSiteInfoUseCase(Container.resolve(settingsRepositoryToken)));
Container.registerSingleton('UpdateSiteInfoUseCase', () => new UpdateSiteInfoUseCase(Container.resolve(settingsRepositoryToken), Container.resolve('GetSiteInfoUseCase')));

Container.registerSingleton('GetVariantHistoryBySkuUseCase', () => new GetVariantHistoryBySkuUseCase(Container.resolve(variantHistoryRepositoryToken)));
Container.registerSingleton('GetAllVariantHistoryUseCase', () => new GetAllVariantHistoryUseCase(Container.resolve(variantHistoryRepositoryToken)));
Container.registerSingleton('GetProductsByRegionUseCase', () => new GetProductsByRegionUseCase(Container.resolve(productRepositoryToken)));

Container.registerSingleton('AddProductToWishlistUseCase', () => new AddProductToWishlistUseCase(Container.resolve(wishlistRepositoryToken), Container.resolve(productRepositoryToken), Container.resolve(userRepositoryToken)));
Container.registerSingleton('RemoveProductFromWishlistUseCase', () => new RemoveProductFromWishlistUseCase(Container.resolve(wishlistRepositoryToken)));
Container.registerSingleton('GetUserWishlistUseCase', () => new GetUserWishlistUseCase(Container.resolve(wishlistRepositoryToken)));

Container.registerSingleton('GetFinancialDashboardUseCase', () => new GetFinancialDashboardUseCase(Container.resolve(financialTransactionRepositoryToken)));

Container.registerSingleton('CreateAddressUseCase', () => new CreateAddressUseCase(Container.resolve(addressRepositoryToken)));
Container.registerSingleton('UpdateAddressUseCase', () => new UpdateAddressUseCase(Container.resolve(addressRepositoryToken)));
Container.registerSingleton('DeleteAddressUseCase', () => new DeleteAddressUseCase(Container.resolve(addressRepositoryToken)));
Container.registerSingleton('ListAddressesByOwnerUseCase', () => new ListAddressesByOwnerUseCase(Container.resolve(addressRepositoryToken)));
Container.registerSingleton('SetMainAddressUseCase', () => new SetMainAddressUseCase(Container.resolve(addressRepositoryToken)));

Container.registerSingleton('ListBannersUseCase', () => new ListBannersUseCase(Container.resolve(bannerRepositoryToken)));
Container.registerSingleton('CreateBannerUseCase', () => new CreateBannerUseCase(Container.resolve(bannerRepositoryToken)));
Container.registerSingleton('UpdateBannerUseCase', () => new UpdateBannerUseCase(Container.resolve(bannerRepositoryToken)));
Container.registerSingleton('DeleteBannerUseCase', () => new DeleteBannerUseCase(Container.resolve(bannerRepositoryToken)));
Container.registerSingleton('UploadBannerImageUseCase', () => new UploadBannerImageUseCase(Container.resolve(bannerRepositoryToken)));
Container.registerSingleton('ListInventoryUseCase', () => new ListInventoryUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('UpdateStockUseCase', () => new UpdateStockUseCase(Container.resolve(productRepositoryToken)));
Container.registerSingleton('CalculateShippingUseCase', () => new CalculateShippingUseCase(Container.resolve('IShippingRuleRepository')));
Container.registerSingleton('ListShippingRulesUseCase', () => new ListShippingRulesUseCase(Container.resolve('IShippingRuleRepository')));
Container.registerSingleton('SaveShippingRuleUseCase', () => new SaveShippingRuleUseCase(Container.resolve('IShippingRuleRepository')));
Container.registerSingleton('ValidateCouponUseCase', () => new ValidateCouponUseCase(Container.resolve('ICouponRepository')));
Container.registerSingleton('ListCouponsUseCase', () => new ListCouponsUseCase(Container.resolve('ICouponRepository')));
Container.registerSingleton('SaveCouponUseCase', () => new SaveCouponUseCase(Container.resolve('ICouponRepository')));
Container.registerSingleton('GetSiteInfoLegacyUseCase', () => new GetSiteInfoLegacyUseCase(Container.resolve(siteConfigRepositoryToken)));

// Controllers
Container.registerSingleton('CategoryController', () => new CategoryController(
  Container.resolve('CreateCategoryUseCase'),
  Container.resolve('ListCategoriesUseCase'),
  Container.resolve('UpdateCategoryUseCase'),
  Container.resolve('DeleteCategoryUseCase')
));
Container.registerSingleton('LeadController', () => new LeadController(
  Container.resolve('CreateLeadUseCase'),
  Container.resolve('ListLeadsUseCase'),
  Container.resolve('GetLeadByIdUseCase'),
  Container.resolve('UpdateLeadStatusUseCase'),
  Container.resolve('DeleteLeadUseCase')
));
Container.registerSingleton('SupplierController', () => new SupplierController(
  Container.resolve('CreateSupplierUseCase'),
  Container.resolve('ListSuppliersUseCase'),
  Container.resolve('GetSupplierByIdUseCase'),
  Container.resolve('UpdateSupplierUseCase'),
  Container.resolve('DeleteSupplierUseCase')
));
Container.registerSingleton('CustomerController', () => new CustomerController(
  Container.resolve('CreateCustomerUseCase'),
  Container.resolve('ListCustomersUseCase'),
  Container.resolve('GetCustomerByIdUseCase'),
  Container.resolve('UpdateCustomerUseCase'),
  Container.resolve('DeleteCustomerUseCase')
));
Container.registerSingleton('CampaignController', () => new CampaignController(
  Container.resolve('CreateCampaignUseCase'),
  Container.resolve('ListCampaignsUseCase'),
  Container.resolve('GetCampaignByIdUseCase'),
  Container.resolve('GetCampaignBySlugUseCase'),
  Container.resolve('UpdateCampaignUseCase'),
  Container.resolve('DeleteCampaignUseCase')
));
Container.registerSingleton('OrderController', () => new OrderController(
  Container.resolve('CreateOrderUseCase'),
  Container.resolve('UpdateOrderStatusUseCase'),
  Container.resolve('CancelOrderUseCase'),
  Container.resolve('ListOrdersUseCase'),
  Container.resolve('GetOrderByIdUseCase'),
  Container.resolve('ConfirmPaymentUseCase'),
  Container.resolve('GetOrderPixUseCase'),
  Container.resolve(productRepositoryToken),
  Container.resolve(orderRepositoryToken),
  Container.resolve(discountServiceToken)
));
Container.registerSingleton('AddressController', () => new AddressController(
  Container.resolve('CreateAddressUseCase'),
  Container.resolve('UpdateAddressUseCase'),
  Container.resolve('DeleteAddressUseCase'),
  Container.resolve('ListAddressesByOwnerUseCase'),
  Container.resolve('SetMainAddressUseCase')
));
Container.registerSingleton('ProductController', () => new ProductController(
  Container.resolve('ListProductsUseCase'),
  Container.resolve('GetProductBySkuUseCase'),
  Container.resolve('CreateProductUseCase'),
  Container.resolve('UpdateProductUseCase'),
  Container.resolve('DeleteProductUseCase'),
  Container.resolve('UploadProductImageUseCase')
));
Container.registerSingleton('SettingsController', () => new SettingsController(
  Container.resolve('GetSettingByKeyUseCase'),
  Container.resolve('GetSettingsUseCase'),
  Container.resolve('ListSettingsUseCase'),
  Container.resolve('CreateSettingsUseCase'),
  Container.resolve('UpdateSettingsUseCase'),
  Container.resolve('DeleteSettingsUseCase'),
  Container.resolve('GetSiteInfoUseCase'),
  Container.resolve('UpdateSiteInfoUseCase')
));
Container.registerSingleton('WishlistController', () => new WishlistController(
  Container.resolve('AddProductToWishlistUseCase'),
  Container.resolve('RemoveProductFromWishlistUseCase'),
  Container.resolve('GetUserWishlistUseCase')
));
Container.registerSingleton('PurchaseController', () => new PurchaseController(
  Container.resolve('CreatePurchaseUseCase'),
  Container.resolve('ListPurchasesUseCase'),
  Container.resolve('GetPurchaseByIdUseCase'),
  Container.resolve('UpdatePurchaseStatusUseCase'),
  Container.resolve('ReceiveInventoryUseCase'),
  Container.resolve('DeletePurchaseUseCase')
));
Container.registerSingleton('ProductHistoryController', () => new ProductHistoryController(
  Container.resolve('GetVariantHistoryBySkuUseCase'),
  Container.resolve('GetAllVariantHistoryUseCase')
));
Container.registerSingleton('FinancialController', () => new FinancialController(
  Container.resolve('GetFinancialDashboardUseCase')
));
Container.registerSingleton('PaymentController', () => new PaymentController(
  Container.resolve('GeneratePaymentQRCodeUseCase')
));
Container.registerSingleton('BannerController', () => new BannerController(
  Container.resolve('ListBannersUseCase'),
  Container.resolve('CreateBannerUseCase'),
  Container.resolve('UpdateBannerUseCase'),
  Container.resolve('DeleteBannerUseCase'),
  Container.resolve('UploadBannerImageUseCase')
));
Container.registerSingleton('InventoryController', () => new InventoryController(
  Container.resolve('ListInventoryUseCase'),
  Container.resolve('UpdateStockUseCase')
));
Container.registerSingleton('ShippingController', () => new ShippingController(
  Container.resolve('CalculateShippingUseCase'),
  Container.resolve('ListShippingRulesUseCase'),
  Container.resolve('SaveShippingRuleUseCase')
));
Container.registerSingleton('CouponController', () => new CouponController(
  Container.resolve('ValidateCouponUseCase'),
  Container.resolve('ListCouponsUseCase'),
  Container.resolve('SaveCouponUseCase')
));
Container.registerSingleton('RegionController', () => new RegionController(
  Container.resolve('GetProductsByRegionUseCase')
));
Container.registerSingleton('SiteConfigController', () => new SiteConfigController(
  Container.resolve('GetSiteInfoLegacyUseCase')
));
Container.registerSingleton('WebhookController', () => new WebhookController(
  Container.resolve(orderRepositoryToken),
  Container.resolve(auditRepositoryToken),
  Container.resolve(paymentProviderToken),
  Container.resolve(financialTransactionRepositoryToken)
));

export const container = {
  // Repositories
  productRepository: () => Container.resolve<IProductRepository>(productRepositoryToken),
  userRepository: () => Container.resolve<IUserRepository>(userRepositoryToken),
  supplierRepository: () => Container.resolve<ISupplierRepository>(supplierRepositoryToken),
  leadRepository: () => Container.resolve<ILeadRepository>(leadRepositoryToken),
  orderRepository: () => Container.resolve<IOrderRepository>(orderRepositoryToken),
  purchaseRepository: () => Container.resolve<IPurchaseRepository>(purchaseRepositoryToken),
  auditRepository: () => Container.resolve<IAuditRepository>(auditRepositoryToken),
  campaignRepository: () => Container.resolve<ICampaignRepository>(campaignRepositoryToken),
  customerRepository: () => Container.resolve<ICustomerRepository>(customerRepositoryToken),
  settingsRepository: () => Container.resolve<ISettingsRepository>(settingsRepositoryToken),
  wishlistRepository: () => Container.resolve<IWishlistRepository>(wishlistRepositoryToken),
  categoryRepository: () => Container.resolve<ICategoryRepository>(categoryRepositoryToken),
  addressRepository: () => Container.resolve<IAddressRepository>(addressRepositoryToken),
  
  // Services
  skuService: () => Container.resolve<SkuService>(skuServiceToken),
  discountService: () => Container.resolve<DiscountService>(discountServiceToken),
  authService: () => Container.resolve<typeof authService>(authServiceToken),
  
  // Controllers
  getCategoryController: () => Container.resolve<CategoryController>('CategoryController'),
  getLeadController: () => Container.resolve<LeadController>('LeadController'),
  getSupplierController: () => Container.resolve<SupplierController>('SupplierController'),
  getCustomerController: () => Container.resolve<CustomerController>('CustomerController'),
  getCampaignController: () => Container.resolve<CampaignController>('CampaignController'),
  getOrderController: () => Container.resolve<OrderController>('OrderController'),
  getAddressController: () => Container.resolve<AddressController>('AddressController'),
  getProductController: () => Container.resolve<ProductController>('ProductController'),
  getSettingsController: () => Container.resolve<SettingsController>('SettingsController'),
  getWishlistController: () => Container.resolve<WishlistController>('WishlistController'),
  getPurchaseController: () => Container.resolve<PurchaseController>('PurchaseController'),
  getProductHistoryController: () => Container.resolve<ProductHistoryController>('ProductHistoryController'),
  getFinancialController: () => Container.resolve<FinancialController>('FinancialController'),
  getPaymentController: () => Container.resolve<PaymentController>('PaymentController'),
  getAdminController: () => Container.resolve<AdminController>('AdminController'),
  getBannerController: () => Container.resolve<BannerController>('BannerController'),
  getInventoryController: () => Container.resolve<InventoryController>('InventoryController'),
  getShippingController: () => Container.resolve<ShippingController>('ShippingController'),
  getCouponController: () => Container.resolve<CouponController>('CouponController'),
  getRegionController: () => Container.resolve<RegionController>('RegionController'),
  getSiteConfigController: () => Container.resolve<SiteConfigController>('SiteConfigController'),
  getWebhookController: () => Container.resolve<WebhookController>('WebhookController'),

  // Explicit use case resolve for specific cases
  getFinancialDashboardUseCase: () => Container.resolve<GetFinancialDashboardUseCase>('GetFinancialDashboardUseCase'),
  listProductsUseCase: () => Container.resolve<ListProductsUseCase>('ListProductsUseCase'),
  getProductBySkuUseCase: () => Container.resolve<GetProductBySkuUseCase>('GetProductBySkuUseCase'),
  createProductUseCase: () => Container.resolve<CreateProductUseCase>('CreateProductUseCase'),
  updateProductUseCase: () => Container.resolve<UpdateProductUseCase>('UpdateProductUseCase'),
  deleteProductUseCase: () => Container.resolve<DeleteProductUseCase>('DeleteProductUseCase'),
  uploadProductImageUseCase: () => Container.resolve<UploadProductImageUseCase>('UploadProductImageUseCase'),
  loginUseCase: () => Container.resolve<LoginUseCase>('LoginUseCase'),
  registerUseCase: () => Container.resolve<RegisterUseCase>('RegisterUseCase'),
  refreshTokenUseCase: () => Container.resolve<RefreshTokenUseCase>('RefreshTokenUseCase'),
  addToWishlistUseCase: () => Container.resolve<AddProductToWishlistUseCase>('AddProductToWishlistUseCase'),
  removeFromWishlistUseCase: () => Container.resolve<RemoveProductFromWishlistUseCase>('RemoveProductFromWishlistUseCase'),
  getUserWishlistUseCase: () => Container.resolve<GetUserWishlistUseCase>('GetUserWishlistUseCase'),
};