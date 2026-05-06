import { EntitySchema } from "typeorm";
import { Coupon } from "../../../core/domain/Coupon";

export const CouponSchema = new EntitySchema<Coupon>({
  name: "Coupon",
  target: Coupon,
  tableName: "coupons",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    code: {
      type: String,
      length: 50,
      unique: true,
    },
    type: {
      type: "varchar",
      length: 20,
    },
    value: {
      type: Number,
    },
    minOrderAmount: {
      type: Number,
      nullable: true,
    },
    expirationDate: {
      type: Date,
      nullable: true,
    },
    maxUses: {
      type: Number,
      nullable: true,
    },
    currentUses: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    }
  }
});
