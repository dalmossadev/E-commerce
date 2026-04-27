// src/infra/database/mappers/AuditLogSchema.ts
import { EntitySchema } from "typeorm";
import { AuditLog } from "@core/domain/AuditLog";
import { User } from "@core/domain/User";

export const AuditLogSchema = new EntitySchema<AuditLog>({
  name: "AuditLog",
  target: AuditLog,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    userId: { type: "int" },
    action: { type: "varchar", length: 20 },
    entity: { type: "varchar", length: 50 },
    entityId: { type: "varchar", length: 100 },
    oldValue: { type: "text", nullable: true },
    newValue: { type: "text", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      onDelete: "NO ACTION"
    },
  },
});