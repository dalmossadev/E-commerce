import "reflect-metadata";
import { AppDataSource } from "../src/infrastructure/database/data-source";
import { Category } from "../src/core/domain/Category";

async function seed() {
  await AppDataSource.initialize();
  const categoryRepo = AppDataSource.getRepository(Category);

  // 1. Create Default Product Category
  let prodCat = await categoryRepo.findOne({ where: { slug: 'geral', type: 'PRODUCT' } });
  if (!prodCat) {
    prodCat = categoryRepo.create({
      name: 'Geral',
      slug: 'geral',
      type: 'PRODUCT',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await categoryRepo.save(prodCat);
  }

  // 2. Create Default Supplier Category
  let suppCat = await categoryRepo.findOne({ where: { slug: 'diversos', type: 'SUPPLIER' } });
  if (!suppCat) {
    suppCat = categoryRepo.create({
      name: 'Diversos',
      slug: 'diversos',
      type: 'SUPPLIER',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await categoryRepo.save(suppCat);
  }

  // 3. Update existing products
  await AppDataSource.query("UPDATE product SET categoryId = ? WHERE categoryId IS NULL", [prodCat.id]);

  // 4. Update existing suppliers
  await AppDataSource.query("UPDATE supplier SET categoryId = ? WHERE categoryId IS NULL", [suppCat.id]);

  console.log("Seed finished");
  await AppDataSource.destroy();
}

seed().catch(console.error);
