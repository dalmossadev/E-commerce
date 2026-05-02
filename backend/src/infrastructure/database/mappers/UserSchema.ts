// src/infra/database/mappers/UserSchema.ts
import { EntitySchema } from "typeorm";
import { User } from "@core/domain/User";
import { AuditLog } from "@core/domain/AuditLog";

export const UserSchema = new EntitySchema<User>({
  name: "User",
  target: User,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    email: { type: "varchar", length: 255, unique: true },
    password: { type: "varchar", length: 255 },
    name: { type: "varchar", length: 255, nullable: true },
    role: { type: "enum", enum: ["admin", "editor", "customer"], default: "customer" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});