import "reflect-metadata";
import { AppDataSource } from "../src/infrastructure/database/data-source";

async function check() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  const columns = await queryRunner.query("SHOW COLUMNS FROM product");
  console.log(JSON.stringify(columns, null, 2));
  await AppDataSource.destroy();
}

check().catch(console.error);
