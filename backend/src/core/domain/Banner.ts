export interface BannerProps {
  id?: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  desktopImage: string;
  mobileImage: string;
  altText: string;
  priority: boolean;
}

export class Banner {
  public readonly id?: string;
  public readonly title!: string;
  public readonly subtitle!: string;
  public readonly cta!: string;
  public readonly ctaHref!: string;
  public readonly desktopImage!: string;
  public readonly mobileImage!: string;
  public readonly altText!: string;
  public readonly priority!: boolean;

  constructor(props?: BannerProps) {
    if (!props) return;
    this.validate(props);

    this.id = props.id;
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.cta = props.cta;
    this.ctaHref = props.ctaHref;
    this.desktopImage = props.desktopImage;
    this.mobileImage = props.mobileImage;
    this.altText = props.altText;
    this.priority = props.priority ?? false;
  }

  private validate(props: BannerProps): void {
    if (!props.title || props.title.length < 3) {
      throw new Error("O título do banner deve ter pelo menos 3 caracteres.");
    }
    if (!props.desktopImage) {
      throw new Error("A imagem desktop é obrigatória.");
    }
    if (!props.ctaHref) {
      throw new Error("O link do CTA é obrigatório.");
    }
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      subtitle: this.subtitle,
      cta: this.cta,
      ctaHref: this.ctaHref,
      desktopImage: this.desktopImage,
      mobileImage: this.mobileImage,
      altText: this.altText,
      priority: this.priority
    };
  }
}