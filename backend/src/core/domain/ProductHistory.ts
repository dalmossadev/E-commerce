// src/core/domain/ProductHistory.ts
export class ProductHistory {
    public id!: string;
    public productId!: number;
    public action!: 'INSERT' | 'UPDATE' | 'DELETE';
    public dataSnapshot!: any; // Foto do produto em JSON
    public changedBy!: string;
    public createdAt!: Date;

    constructor(props: Partial<ProductHistory>) {
        Object.assign(this, props);
    }
}