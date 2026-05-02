'use server';

import { LeadManager, CreateLeadDTO } from '@/modules/lead-controller';

export async function createLeadAction(formData: FormData) {
  try {
    const data: CreateLeadDTO = {
      sku: formData.get('sku') as string,
      customerName: formData.get('customerName') as string,
      customerPhone: formData.get('customerPhone') as string,
      customerEmail: formData.get('customerEmail') as string || undefined,
      productId: formData.get('productId') ? Number(formData.get('productId')) : undefined,
      notes: formData.get('notes') as string || undefined,
    };

    const manager = new LeadManager();
    const lead = await manager.create(data);

    return { success: true, data: lead };
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar lead',
    };
  }
}
