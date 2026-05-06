import { Address } from './Address';

export class Customer {
  id!: number;
  fullName!: string;
  cpf!: string;
  phone!: string;
  addresses!: Address[];
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<Customer> = {} ) {
    Object.assign(this, data);
  }
}
