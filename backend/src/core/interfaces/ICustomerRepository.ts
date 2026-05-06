import { Customer } from '@core/domain/Customer';
import { CustomerQueryDTO } from '@core/dto/CustomerDTO';

export interface ICustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findAll(query?: CustomerQueryDTO): Promise<{ data: Customer[]; total: number; page: number; limit: number; totalPages: number }>;
  update(customer: Customer): Promise<Customer>;
  delete(id: number): Promise<void>;
  findByCpf(cpf: string): Promise<Customer | null>;
  countAll(): Promise<number>;
}
