// src/core/domain/Address.ts
export class Address {
  id!: number;
  street!: string;
  number!: string;
  complement?: string;
  neighborhood!: string;
  city!: string;
  state!: string; // UF (ex: BA, SP)
  zipCode!: string;
  latitude?: number;
  longitude?: number;
  isMain: boolean = false;
  tag?: string; // Ex: 'Casa', 'Trabalho', 'Matriz'
  
  customerId?: number;
  customer?: any; // Adicionado para suportar relação TypeORM
  supplierId?: number;
  supplier?: any; // Adicionado para suportar relação TypeORM

  constructor(props: Partial<Address> = {}) {
    Object.assign(this, props);
  }
}
