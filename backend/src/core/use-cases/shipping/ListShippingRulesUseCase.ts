import { IShippingRuleRepository } from "@core/interfaces/IShippingRuleRepository";
import { ShippingRule } from "@core/domain/ShippingRule";

export class ListShippingRulesUseCase {
  constructor(private shippingRepository: IShippingRuleRepository) {}

  async execute(): Promise<ShippingRule[]> {
    return await this.shippingRepository.findAll();
  }
}
