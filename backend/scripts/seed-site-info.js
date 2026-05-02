require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedSiteInfo() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('Database connected');

    const siteInfoSettings = [
      { key: 'site_name', value: 'SHOP VAREJO' },
      { key: 'site_tagline', value: 'Produtos selecionados. Qualidade garantida.' },
      { key: 'site_description', value: 'E-commerce premium com estoque selecionado e entrega via WhatsApp.' },
      { key: 'site_whatsapp_number', value: '557187833065' },
      { key: 'site_whatsapp_message', value: 'Olá! Vi o site e tenho interesse em um produto.' },
      { key: 'site_instagram_url', value: 'https://instagram.com/shopvarejo' },
    ];

    for (const setting of siteInfoSettings) {
      const [rows] = await connection.execute(
        'SELECT id FROM settings WHERE `key` = ?',
        [setting.key]
      );

      if (rows.length === 0) {
        await connection.execute(
          'INSERT INTO settings (`key`, `value`) VALUES (?, ?)',
          [setting.key, setting.value]
        );
        console.log(`Created: ${setting.key}`);
      } else {
        console.log(`Already exists: ${setting.key}`);
      }
    }

    console.log('Site info seed completed!');
  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedSiteInfo();
