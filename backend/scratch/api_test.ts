import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function test() {
  console.log("Starting API tests...");

  try {
    // 1. Create a new category
    console.log("T3: Creating category...");
    const catRes = await axios.post(`${API_BASE}/categories`, {
      name: 'Teste de API',
      slug: `teste-api-${Date.now()}`,
      type: 'PRODUCT',
      description: 'Categoria criada para teste automatizado'
    });
    const category = catRes.data;
    console.log("Category created:", category.id);

    // 2. List categories
    console.log("Listing categories...");
    const listRes = await axios.get(`${API_BASE}/categories`);
    console.log("Total categories:", listRes.data.length);

    // 3. Create product with this category
    console.log("T4: Creating product...");
    const prodRes = await axios.post(`${API_BASE}/products`, {
      name: 'Produto Teste API',
      brand: 'Sisters Lab',
      categoryId: category.id,
      basePrice: 100,
      attributes: {
        colors: ['Branco'],
        sizes: ['M']
      },
      description: 'Produto criado via teste de API'
    });
    const product = prodRes.data;
    console.log("Product created:", product.id);

    // 4. List products by category
    console.log("T5: Filtering products by category...");
    const filterRes = await axios.get(`${API_BASE}/products?categoryId=${category.id}`);
    console.log("Products in category:", filterRes.data.data.length);
    if (filterRes.data.data.length === 0) {
      throw new Error("Filtered list should not be empty");
    }

    // 5. Create supplier with category (using category 2 - Diversos or creating a new one)
    console.log("T6: Creating supplier...");
    const cnpj = `123456780001${Math.floor(Math.random() * 90 + 10)}`;
    const suppRes = await axios.post(`${API_BASE}/suppliers`, {
      companyName: 'Fornecedor Teste API',
      tradeName: 'Teste API',
      cnpj: cnpj,
      contactEmail: 'teste@api.com',
      categoryId: 2 // Diversos
    });
    console.log("Supplier created:", suppRes.data.id);

    console.log("--- ALL API TESTS PASSED ---");
  } catch (error: any) {
    console.error("API Test FAILED:", error.response?.data || error.message);
    process.exit(1);
  }
}

test();
