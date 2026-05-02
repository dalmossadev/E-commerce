import 'reflect-metadata';
import { AppDataSource } from './infrastructure/database/data-source';
import { Settings } from './core/domain/Settings';

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Settings);

  const initialSettings = [
    { key: 'site_name', value: 'SHOP VAREJO' },
    { key: 'site_tagline', value: 'Produtos selecionados. Qualidade garantida.' },
    { key: 'site_description', value: 'E-commerce premium com estoque selecionado e entrega via WhatsApp.' },
    { key: 'site_whatsapp_number', value: '557187833065' },
    { key: 'site_whatsapp_message', value: 'Olá! Vi o site e tenho interesse em um produto.' },
    { key: 'site_instagram_url', value: 'https://instagram.com/shopvarejo' },
  ];

  for (const s of initialSettings) {
    const existing = await repo.findOne({ where: { key: s.key } });
    if (!existing) {
      await repo.save(new Settings(s));
      console.log(`Setting created: ${s.key}`);
    } else {
      console.log(`Setting already exists: ${s.key}`);
    }
  }

  process.exit(0);
}

run();
