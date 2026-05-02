// src/core/domain/Settings.ts
export class Settings {
  public id!: number;
  public key!: string;   // Ex: 'store_whatsapp', 'store_name'
  public value!: string; // Ex: '5571999999999'
  public createdAt!: Date;
  public updatedAt!: Date;

  constructor(props: Partial<Settings> = {}) {
    Object.assign(this, props);
  }
}