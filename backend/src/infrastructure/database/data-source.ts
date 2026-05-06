// src/infra/database/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
// Importamos o Schema que mapeia nossa entidade pura para o banco
import { ProductSchema } from "./mappers/ProductSchema";
import { ProductVariantSchema } from "./mappers/ProductVariantSchema";
import { UserSchema } from "./mappers/UserSchema";
import { CustomerSchema } from "./mappers/CustomerSchema";
import { SupplierSchema } from "./mappers/SupplierSchema";
import { UserProfileSchema } from "./mappers/UserProfileSchema";
import { CampaignSchema } from "./mappers/CampaignSchema";
import { SettingsSchema } from "./mappers/SettingsSchema";
import { AuditLogModel } from "./models/AuditLogModel";
import { ProductHistorySchema } from "./mappers/ProductHistorySchema";
import { VariantHistorySchema } from "./mappers/VariantHistorySchema";
import { OrderSchema } from "./mappers/OrderSchema";
import { OrderItemSchema } from "./mappers/OrderItemSchema";
import { PurchaseSchema } from "./mappers/PurchaseSchema";
import { PurchaseItemSchema } from "./mappers/PurchaseItemSchema";
import { LeadSchema } from "./mappers/LeadSchema";
import { WishlistSchema } from "./mappers/WishlistSchema";
import { BannerSchema } from "./mappers/BannerSchema";
import { PaymentSchema } from "./mappers/PaymentSchema";
import { SiteConfigSchema } from "./mappers/SiteConfigSchema";
import { FinancialTransactionSchema } from "./mappers/FinancialTransactionSchema";
import { AddressSchema } from "./mappers/AddressSchema";
import { CategorySchema } from "./mappers/CategorySchema";
import { ShippingRuleSchema } from "./mappers/ShippingRuleSchema";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    
    // ATENÇÃO: synchronize: false evita conflitos com schema existente
synchronize: true,
    logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,

    // Registramos o Schema aqui em vez de classes decoradas
    entities: [
        ProductSchema,
        ProductVariantSchema,
        UserSchema,
        UserProfileSchema,
        CustomerSchema,
        SupplierSchema,
        CampaignSchema,
        SettingsSchema,
        AuditLogModel,
        VariantHistorySchema,
        ProductHistorySchema,
        OrderSchema,
        OrderItemSchema,
        PurchaseSchema,
        PurchaseItemSchema,
        LeadSchema,
        WishlistSchema,
        BannerSchema,
        PaymentSchema,
        SiteConfigSchema,
        FinancialTransactionSchema,
        AddressSchema,
        CategorySchema,
        ShippingRuleSchema,
    ],
    
    // Mantemos o caminho para migrations caso precise no futuro
    migrations: ["src/infra/database/migrations/*.ts"],
});