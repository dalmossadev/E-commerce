import 'dotenv/config';
import { AppDataSource } from '@infrastructure/database/data-source';
import { User } from '@core/domain/User';
import { UserRole } from '@core/dto/AuthDTO';
import * as bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = AppDataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@sisterslab.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      await AppDataSource.destroy();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = new User();
    adminUser.email = 'admin@sisterslab.com';
    adminUser.password = hashedPassword;
    adminUser.name = 'Admin Sisters Lab';
    adminUser.role = UserRole.ADMIN;

    await userRepository.save(adminUser);

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@sisterslab.com');
    console.log('   Password: password123');
    console.log('   Role:', UserRole.ADMIN);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
