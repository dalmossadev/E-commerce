// src/infra/database/mappers/UserProfileSchema.ts
import { EntitySchema } from "typeorm";
import { UserProfile } from "@core/domain/UserProfile";

export const UserProfileSchema = new EntitySchema<UserProfile>({
  name: "UserProfile",
  target: UserProfile,
  columns: {
    id: { type: "int", primary: true, generated: "increment" },
    userId: { type: "int", unique: true }, // Garante que 1 user tenha apenas 1 profile
    firstName: { type: "varchar", length: 100 },
    lastName: { type: "varchar", length: 100 },
    birthDate: { type: "date", nullable: true },
    phoneNumber: { type: "varchar", length: 20, nullable: true },
    avatarUrl: { type: "varchar", length: 255, nullable: true },
    bio: { type: "text", nullable: true },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE", // Se deletar o User, o Profile apaga junto
    },
  },
});