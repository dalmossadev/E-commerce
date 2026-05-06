import { ShippingRule } from "../domain/ShippingRule";

export interface IShippingRuleRepository {
  findAll(): Promise<ShippingRule[]>;
  findById(id: number): Promise<ShippingRule | null>;
  findByZipCode(zipCode: string): Promise<ShippingRule | null>;
  save(rule: ShippingRule): Promise<ShippingRule>;
  delete(id: number): Promise<void>;
}
