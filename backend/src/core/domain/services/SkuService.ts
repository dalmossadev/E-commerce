import { SkuInput } from '../../interfaces/IProductSKU';

export interface ISkuFormatter {
    format(input: SkuInput): string;
}

export class DefaultSkuFormatter implements ISkuFormatter {
    private colorMap: Record<string, string> = {
        preto: 'PRE',
        branco: 'BRA',
        azul: 'AZU',
        vermelho: 'VER',
        verde: 'VRD',
        amarelo: 'AMA',
    };

    private sizeMap: Record<string, string> = {
        p: 'P', pequeno: 'P',
        m: 'M', medio: 'M',
        g: 'G', grande: 'G',
        gg: 'GG', xg: 'XG'
    };

    format(input: SkuInput): string {
        const brand = this.getBrandCode(input.brand);
        const name = this.getNameCode(input.name);
        const category = this.getCategoryCode(input.category);
        const color = this.getColorCode(input.color);
        const size = this.getSizeCode(input.size);

        let sku = `${brand}-${name}-${category}-${color}-${size}`;

        if (input.uniqueId) {
            sku += `-${this.getShortId(input.uniqueId)}`;
        }

        return sku;
    }

    private normalize(value: string): string {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '');
    }

    private getBrandCode(brand: string): string {
        return this.normalize(brand).slice(0, 3);
    }

    private getNameCode(name: string): string {
        return this.normalize(name).slice(0, 7);
    }

    private getCategoryCode(category: string): string {
        return this.normalize(category).slice(0, 3);
    }

    private getColorCode(color: string): string {
        const key = color.toLowerCase().trim();
        return this.colorMap[key] || this.normalize(color).slice(0, 3);
    }

    private getSizeCode(size: string): string {
        const key = size.toLowerCase().trim();
        return this.sizeMap[key] || this.normalize(size);
    }

    private getShortId(id: string): string {
        return id.replace(/[^A-Z0-9]/gi, '').slice(0, 4).toUpperCase();
    }
}

export class SkuService {
    private formatter: ISkuFormatter;

    constructor(formatter?: ISkuFormatter) {
        this.formatter = formatter || new DefaultSkuFormatter();
    }

    generate(input: SkuInput): string {
        this.validateInput(input);
        return this.formatter.format(input);
    }

    private validateInput(input: SkuInput): void {
        if (!input.brand || input.brand.trim().length === 0) {
            throw new Error('Brand is required for SKU generation');
        }
        if (!input.name || input.name.trim().length === 0) {
            throw new Error('Name is required for SKU generation');
        }
        if (!input.category || input.category.trim().length === 0) {
            throw new Error('Category is required for SKU generation');
        }
        if (!input.color || input.color.trim().length === 0) {
            throw new Error('Color is required for SKU generation');
        }
        if (!input.size || input.size.trim().length === 0) {
            throw new Error('Size is required for SKU generation');
        }
    }

    setFormatter(formatter: ISkuFormatter): void {
        this.formatter = formatter;
    }
}