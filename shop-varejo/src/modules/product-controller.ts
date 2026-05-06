// src/modules/product-controller.ts
// Importação das interfaces necessárias para o tipo de dados do produto
import { ProductCategory,
     ProductBadge,
      Product
       } from '../types/interfaces';


const API_BASE_URL = 'http://localhost:3001';

export class ProductManager {
  private endpoint = `${API_BASE_URL}/api/admin/products`;

  /**
   * Trata o objeto de produto antes de enviar para o banco.
   * Exemplo: Garante que o preço está em centavos.
   */
  private prepareData(data: Partial<Product>) {
    return {
      ...data,
      // Lógica de sanitização ou transformação aqui
      price: data.price ? Math.round(data.price) : 0,
      sku: data.sku?.toUpperCase().trim(),
    };
  }

  // ── CRUD Operations ─────────────────────────────────────────────────

  async getAll(): Promise<Product[]> {
    const response = await fetch(this.endpoint);
    if (!response.ok) throw new Error("Erro ao buscar produtos");
    return response.json();
  }

  async create(productData: Product): Promise<Product> {
    const sanitized = this.prepareData(productData);

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    });

    return response.json();
  }

  async update(sku: string, updates: Partial<Product>): Promise<Product> {
    const sanitized = this.prepareData(updates);

    const response = await fetch(`${this.endpoint}/${sku}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    });

    return response.json();
  }

  async delete(sku: string): Promise<boolean> {
    const response = await fetch(`${this.endpoint}/${sku}`, {
      method: "DELETE",
    });
    return response.ok;
  }

  async getBySku(sku: string): Promise<Product | null> {
    // O filtro acontece no banco de dados, retornando apenas 1 objeto
    const response = await fetch(`${this.endpoint}/${sku}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Erro ao buscar produto");
    return response.json();
  }
} // Fim da classe ProductManager

// ----------------------------------------------------------------------
//// Exemlo de uso do ProductManager para atualizar um produto existente
const productManager = new ProductManager();
productManager.update('12345', { price: 99.99, name: 'Produto Atualizado' });

// Exemplo de uso do ProductManager para criar um novo produto
productManager.create({
  id: 0,
  sku: '12345',
  name: 'Novo Produto',
  description: 'Descrição do novo produto',
  price: 199.99,
  imageName: 'produto.jpg',
  altText: 'Imagem do produto',
  categoryId: 1, // ID da categoria
  badge: 'novo',
  inStock: true,
  featured: false,
});

// Exemlo de uso do ProductManager para buscar todos os produtos
productManager.getAll().then(products => console.log(products));

// Exemlo de uso do ProductManager para deletar um produto
productManager.delete('12345').then(success => {
  if (success) {
    console.log('Produto deletado com sucesso');
  } else {
    console.log('Falha ao deletar o produto');
  }
});

// Exemplo de uso do ProductManager para localizar um produto específico
productManager.getAll().then(products => {
  const product = products.find(p => p.sku === '12345');
  if (product) {
    console.log('Produto encontrado:', product);
  } else {
    console.log('Produto não encontrado');
  }
});

// Exemplo de uso do ProductManager para localizar um produto específico usando getBySku
//  pensando na performance, já que o filtro acontece no banco de dados e retorna apenas
//  1 objeto
productManager.getBySku('12345').then(product => {
  if (product) {
    console.log('Produto encontrado:', product);
  } else {
    console.log('Produto não encontrado');
  }
});

const product =  productManager.getBySku('12345'); // Otimizado (O(1) na rede)


// Transformamos o Array em um Objeto Indexado ou Map
async function createProductMap() {
  const list_product = await productManager.getAll();
  const productMap = new Map(list_product.map(p => [p.sku, p]));

  // Busca instantânea
  const product_for_id = productMap.get('12345');
}