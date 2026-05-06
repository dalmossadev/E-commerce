import { EntitySchema } from "typeorm";
import { ShippingRule } from "../../../core/domain/ShippingRule";

export const ShippingRuleSchema = new EntitySchema<ShippingRule>({
  name: "ShippingRule",
  target: ShippingRule,
  tableName: "shipping_rules",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    name: {
      type: "varchar",
      length: 100,
    },
    zipStart: {
      type: "varchar",
      length: 10,
    },
    zipEnd: {
      type: "varchar",
      length: 10,
    },
    price: {
      type: "int", // em centavos
    },
    minAmountForFreeShipping: {
      type: "int",
      nullable: true,
    },
    estimatedDays: {
      type: "int",
    },
    active: {
      type: "boolean",
      default: true,
    }
  }
});
