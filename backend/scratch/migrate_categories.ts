import "reflect-metadata";
import { AppDataSource } from "../src/infrastructure/database/data-source";
import { Category } from "../src/core/domain/Category";

async function migrate() {
  await AppDataSource.initialize();
  console.log("Database initialized");

  const queryRunner = AppDataSource.createQueryRunner();

  // 1. Get unique product categories
  const productCategories: any[] = await queryRunner.query("SELECT DISTINCT category FROM product WHERE category IS NOT NULL AND category != ''");
  console.log(`Found ${productCategories.length} product categories`);

  // 2. Get unique supplier categories
  const supplierCategories: any[] = await queryRunner.query("SELECT DISTINCT category FROM supplier WHERE category IS NOT NULL AND category != ''");
  console.log(`Found ${supplierCategories.length} supplier categories`);

  const categoryRepo = AppDataSource.getRepository(Category);

  // Helper to create category
  const getOrCreateCategory = async (name: string, type: 'PRODUCT' | 'SUPPLIER') => {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    let category = await categoryRepo.findOne({ where: { slug, type } });
    if (!category) {
      category = categoryRepo.create({
        name,
        slug,
        type,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await categoryRepo.save(category);
      console.log(`Created ${type} category: ${name}`);
    }
    return category;
  };

  // Process products
  for (const row of productCategories) {
    const cat = await getOrCreateCategory(row.category, 'PRODUCT');
    await queryRunner.query("UPDATE product SET categoryId = ? WHERE category = ?", [cat.id, row.category]);
  }

  // Process suppliers
  for (const row of supplierCategories) {
    const cat = await getOrCreateCategory(row.category, 'SUPPLIER');
    await queryRunner.query("UPDATE supplier SET categoryId = ? WHERE category = ?", [cat.id, row.category]);
  }

  console.log("Migration finished");
  await AppDataSource.destroy();
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
