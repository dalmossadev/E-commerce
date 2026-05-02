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
  private props: BannerProps;

  constructor(props: BannerProps) {
    // Validação de Regra de Negócio (Exemplo)
    if (!props.title || props.title.length < 3) {
      throw new Error("O título do banner deve ter pelo menos 3 caracteres.");
    }
    
    // Garantimos que o objeto nasce com todos os dados obrigatórios
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID() // Gera ID se não fornecido
    };
  }

  // Getters para manter o encapsulamento (O-Open/Closed)
  get id(): string | undefined { return this.props.id; }
  get title(): string { return this.props.title; }
  get desktopImage(): string { return this.props.desktopImage; }
  get priority(): boolean { return this.props.priority; }

  // Se precisar alterar algo, use métodos semânticos, não setters genéricos
  public updateTitle(newTitle: string): void {
    if (newTitle.length < 3) throw new Error("Título inválido");
    this.props.title = newTitle;
  }
  
  public toJSON() {
    return { ...this.props };
  }
}