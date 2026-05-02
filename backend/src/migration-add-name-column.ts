import 'dotenv/config';
import { AppDataSource } from '@infrastructure/database/data-source';

async function addNameColumn() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
      const table = await queryRunner.getTable('user');
      const nameColumn = table?.findColumnByName('name');

      if (nameColumn) {
        console.log('⚠️  Column "name" already exists in "user" table');
      } else {
        await queryRunner.addColumn(table!, new (await import('typeorm')).TableColumn({
          name: 'name',
          type: 'varchar',
          length: '255',
          isNullable: true,
        }));
        console.log('✅ Column "name" added to "user" table');
      }
    } finally {
      await queryRunner.release();
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding column:', error);
    process.exit(1);
  }
}

addNameColumn();
