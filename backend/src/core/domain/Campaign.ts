// src/core/domain/Campaign.ts
export class Campaign {
  id!: number;
  name!: string;          // Ex: "Dia das Mães 2026"
  slug!: string;          // Ex: "dia-das-maes"
  messageTemplate!: string; // Ex: "Olá! Vi o produto {{productName}} e gostaria de saber mais..."
  isActive!: boolean;
  startDate?: Date;
  endDate?: Date;
  targetUrl?: string;     // Caso queira redirecionar para uma landing page

  constructor(data: Partial<Campaign> = {}) {
    Object.assign(this, data);
  }
}