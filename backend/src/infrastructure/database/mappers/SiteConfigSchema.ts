// src/infrastructure/database/mappers/SiteConfigSchema.ts
import { EntitySchema } from "typeorm";
import { SiteConfig } from "@core/domain/SiteConfig";

export const SiteConfigSchema = new EntitySchema<SiteConfig>({
  name: "SiteConfig",
  target: SiteConfig,
  tableName: "site_configs",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    name: {
      type: "varchar",
      length: 255,
    },
    tagline: {
      type: "varchar",
      length: 255,
    },
    description: {
      type: "text",
    },
    whatsappNumber: {
      type: "varchar",
      length: 20,
    },
    whatsappMessage: {
      type: "text",
    },
    instagramUrl: {
      type: "varchar",
      length: 255,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});
