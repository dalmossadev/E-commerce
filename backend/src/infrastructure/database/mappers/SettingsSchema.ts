

// src/infra/database/mappers/SettingsSchema.ts
import { EntitySchema } from "typeorm";
import { Settings } from "@core/domain/Settings";

export const SettingsSchema = new EntitySchema<Settings>({
  name: "Settings",
  target: Settings,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    key: { type: "varchar", length: 50, unique: true },
    value: { type: "text" },
  },
});