
// src/core/domain/Customer.ts
export class Customer {
  id!: number;
  fullName!: string;
  cpf!: string;
  phone!: string;
  address!: Record<string, any>;

  constructor(data: Partial<Customer> = {} ) {
    Object.assign(this, data);
  }
}
