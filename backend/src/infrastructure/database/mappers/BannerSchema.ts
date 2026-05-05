import { EntitySchema } from "typeorm";
import { BannerProps } from "@core/domain/Banner";

export const BannerSchema = new EntitySchema<BannerProps>({
  name: "Banner",
  tableName: "banners",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    title: { type: "varchar" },
    subtitle: { type: "varchar" },
    cta: { type: "varchar" },
    ctaHref: { type: "varchar" },
    desktopImage: { type: "varchar" },
    mobileImage: { type: "varchar" },
    altText: { type: "varchar" },
    priority: { type: "boolean", default: false }
  }
});