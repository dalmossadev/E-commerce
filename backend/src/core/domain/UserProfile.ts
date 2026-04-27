// src/core/domain/UserProfile.ts
import { User } from "./User";

export class UserProfile {
  public id!: number;
  public userId!: number;
  public firstName!: string;
  public lastName!: string;
  public birthDate?: Date;
  public phoneNumber?: string;
  public avatarUrl?: string;
  public bio?: string;
  
  // Adicione esta linha para o TypeScript reconhecer a relação
  public user?: User; 

  constructor(props: Partial<UserProfile> = {}) {
    Object.assign(this, props);
  }
}