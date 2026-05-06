import { ProductVariant } from "./ProductVariant";
import { User } from "./User";
import { Category } from "./Category";

// src/core/domain/Product.ts
export type ProductBadge = 'novo' | 'oferta' | 'exclusivo' | 'esgotando' | 'lancamento' | null;

export class Product {
    public id!: number;
    public name!: string;
    public brand?: string | null;
    public description!: string | "";
    public basePrice?: number | null;
    public originalPrice?: number | null = null;
    public imageName!: string;
    public imageUrl?: string | null = null;  // Definido pelo Use Case com URL completa
    public altText!: string;
    public categoryId!: number;
    public category?: Category;
    public badge?: ProductBadge | null = null;
    public inStock?: boolean = true;
    public featured?: boolean = false;
    public specs?: Record<string, string> | null = null;
    public variants!: ProductVariant[];
    public modifier?: User;
    public updatedBy?: number | null = null;
    public createdAt!: Date;
    public updatedAt!: Date;

  constructor(props: Partial<Product> = {}) {
    Object.assign(this, props);
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
}

    public get discountPercentage(): number {
        if (!this.originalPrice || !this.basePrice || this.originalPrice <= this.basePrice) {
            return 0;
        }
        return Math.round(((this.originalPrice - this.basePrice) / this.originalPrice) * 100);
    }

    public get hasDiscount(): boolean {
        return this.discountPercentage > 0;
    }

    public get hasVariants(): boolean {
        return this.variants && this.variants.length > 0;
    }

    public get totalStock(): number {
        if (!this.variants || this.variants.length === 0) {
            return 0;
        }
        return this.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    }

    public get isFeatured(): boolean {
        return this.featured === true;
    }

    public markAsFeatured(): void {
        this.featured = true;
        this.updatedAt = new Date();
    }

    public unmarkAsFeatured(): void {
        this.featured = false;
        this.updatedAt = new Date();
    }

    public setOriginalPrice(price: number | null): void {
        if (price !== null && this.basePrice && price <= this.basePrice) {
            throw new Error('Original price must be greater than base price');
        }
        this.originalPrice = price;
        this.updatedAt = new Date();
    }

    public applyDiscount(discountedPrice: number): void {
        if (!this.basePrice || discountedPrice >= this.basePrice) {
            throw new Error('Discounted price must be less than current base price');
        }
        this.originalPrice = this.basePrice;
        this.basePrice = discountedPrice;
        this.updatedAt = new Date();
    }

    public updateBasePrice(newPrice: number): void {
        if (newPrice <= 0) {
            throw new Error('Price must be greater than zero');
        }
        this.basePrice = newPrice;
        this.updatedAt = new Date();
    }

    public updateCategory(categoryId: number): void {
        this.categoryId = categoryId;
        this.updatedAt = new Date();
    }

    public addVariant(variant: ProductVariant): void {
        if (!this.variants) {
            this.variants = [];
        }
        this.variants.push(variant);
    }

    public removeVariant(sku: string): void {
        if (this.variants) {
            this.variants = this.variants.filter(v => v.sku !== sku);
        }
    }

    public findVariantBySku(sku: string): ProductVariant | undefined {
        return this.variants?.find(v => v.sku === sku);
    }

    public updateStock(quantity: number): void {
        this.updatedAt = new Date();
    }
}