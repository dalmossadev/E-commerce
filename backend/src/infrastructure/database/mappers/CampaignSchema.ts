// src/infra/database/mappers/CampaignSchema.ts
import { EntitySchema } from "typeorm";
import { Campaign } from "@core/domain/Campaign";

export const CampaignSchema = new EntitySchema<Campaign>({
  name: "Campaign",
  target: Campaign,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    name: { type: "varchar", length: 100 },
    slug: { type: "varchar", length: 50, unique: true },
    messageTemplate: { type: "text" }, // Aqui salvamos o corpo da mensagem
    isActive: { type: "boolean", default: true },
    startDate: { type: "timestamp", nullable: true },
    endDate: { type: "timestamp", nullable: true },
  }
});