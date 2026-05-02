import dotenv from 'dotenv';
import { createConnection } from 'typeorm';

dotenv.config();

async function seedSiteInfo() {
  let connection: any;
  
  try {
    connection = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/core/domain/*.ts'],
      synchronize: false,
      logging: false,
    });

    console.log('Database connected');

    const settingsRepository = connection.getRepository('Settings');

    const siteInfoSettings = [
      { key: 'site_name', value: 'SHOP VAREJO' },
      { key: 'site_tagline', value: 'Produtos selecionados. Qualidade garantida.' },
      { key: 'site_description', value: 'E-commerce premium com estoque selecionado e entrega via WhatsApp.' },
      { key: 'site_whatsapp_number', value: '557187833065' },
      { key: 'site_whatsapp_message', value: 'Olá! Vi o site e tenho interesse em um produto.' },
      { key: 'site_instagram_url', value: 'https://instagram.com/shopvarejo' },
    ];

    for (const setting of siteInfoSettings) {
      const existing = await settingsRepository.findOne({ where: { key: setting.key } });
      
      if (!existing) {
        await settingsRepository.save(setting);
        console.log(`Created: ${setting.key}`);
      } else {
        console.log(`Already exists: ${setting.key}`);
      }
    }

    console.log('Site info seed completed!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

seedSiteInfo();
