import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { ShippingRule } from "@core/domain/ShippingRule";
import { ShippingRuleSchema } from "../mappers/ShippingRuleSchema";
import { IShippingRuleRepository } from "@core/interfaces/IShippingRuleRepository";

export class TypeORMShippingRuleRepository implements IShippingRuleRepository {
  private repository: Repository<ShippingRule>;

  constructor() {
    this.repository = AppDataSource.getRepository(ShippingRuleSchema);
  }

  async findAll(): Promise<ShippingRule[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<ShippingRule | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByZipCode(zipCode: string): Promise<ShippingRule | null> {
    const cleanZip = zipCode.replace(/\D/g, '');
    const rules = await this.repository.find({ where: { active: true } });
    
    // Filtro manual pois ranges de CEP em string podem ser complexos em SQL puro dependendo do provider
    // Mas para simplificar, buscaremos a regra que engloba o CEP
    const rule = rules.find(r => cleanZip >= r.zipStart && cleanZip <= r.zipEnd);
    return rule || null;
  }

  async save(rule: ShippingRule): Promise<ShippingRule> {
    return await this.repository.save(rule);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
