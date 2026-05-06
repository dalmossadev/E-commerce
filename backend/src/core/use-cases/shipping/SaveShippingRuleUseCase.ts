import { IShippingRuleRepository } from "@core/interfaces/IShippingRuleRepository";
import { ShippingRule } from "@core/domain/ShippingRule";

export class SaveShippingRuleUseCase {
  constructor(private shippingRepository: IShippingRuleRepository) {}

  async execute(data: any): Promise<ShippingRule> {
    const rule = new ShippingRule({
      ...data,
      zipStart: data.zipStart.replace(/\D/g, ''),
      zipEnd: data.zipEnd.replace(/\D/g, ''),
    });
    return await this.shippingRepository.save(rule);
  }
}
