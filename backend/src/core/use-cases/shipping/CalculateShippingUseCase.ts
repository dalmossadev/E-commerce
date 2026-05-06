import { IShippingRuleRepository } from "@core/interfaces/IShippingRuleRepository";
import { ShippingRule } from "@core/domain/ShippingRule";

export class CalculateShippingUseCase {
  constructor(private shippingRepository: IShippingRuleRepository) {}

  async execute(zipCode: string, orderAmount: number): Promise<{
    price: number;
    estimatedDays: number;
    ruleName: string;
    freeShippingThreshold?: number;
  }> {
    const rule = await this.shippingRepository.findByZipCode(zipCode);
    if (!rule) {
      throw new Error("Não entregamos nesta região ainda.");
    }

    const price = rule.calculatePrice(orderAmount);

    return {
      price,
      estimatedDays: rule.estimatedDays,
      ruleName: rule.name,
      freeShippingThreshold: rule.minAmountForFreeShipping
    };
  }
}
