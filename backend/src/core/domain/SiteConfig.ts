// src/core/domain/SiteConfig.ts
import { AppError } from "../errors/AppError";

export interface SiteConfigProps {
  id?: number;
  name: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramUrl: string;
  updatedAt?: Date;
}

export class SiteConfig {
  public readonly id?: number;
  public readonly name!: string;
  public readonly tagline!: string;
  public readonly description!: string;
  public readonly whatsappNumber!: string;
  public readonly whatsappMessage!: string;
  public readonly instagramUrl!: string;
  public readonly updatedAt!: Date;

  constructor(props?: SiteConfigProps) {
    if (!props) return;
    this.validate(props);

    this.id = props.id;
    this.name = props.name;
    this.tagline = props.tagline;
    this.description = props.description;
    this.whatsappNumber = props.whatsappNumber;
    this.whatsappMessage = props.whatsappMessage;
    this.instagramUrl = props.instagramUrl;
    this.updatedAt = props.updatedAt || new Date();
  }

  private validate(props: SiteConfigProps): void {
    if (!props.name || props.name.length < 2) {
      throw new AppError("Site name is required and must be at least 2 characters", 400);
    }
    if (!props.whatsappNumber || props.whatsappNumber.length < 10) {
      throw new AppError("A valid WhatsApp number is required", 400);
    }
  }
}
