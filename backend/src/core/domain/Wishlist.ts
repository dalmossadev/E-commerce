import { User } from "./User";
import { Product } from "./Product";
import { Lead } from "./Lead";

export class Wishlist {
    public id!: number;
    public userId?: number;
    public leadId?: number;
    public productId!: number;
    public user?: User;
    public lead?: Lead;
    public product?: Product;
    public createdAt!: Date;

    constructor(props: Partial<Wishlist> = {}) {
        Object.assign(this, props);
        this.createdAt = props.createdAt || new Date();
    }
}
