import 'reflect-metadata';
import { AppDataSource } from './src/infrastructure/database/data-source';
import { Order, OrderStatus, PaymentMethod } from './src/core/domain/Order';
import { FinancialTransaction, TransactionType, ReferenceType, TransactionStatus } from './src/core/domain/FinancialTransaction';

async function populateLedger() {
  console.log('Iniciando sincronização retroativa do Ledger...');
  
  await AppDataSource.initialize();
  console.log('Database connected!');

  const orderRepository = AppDataSource.getRepository(Order);
  const financialRepository = AppDataSource.getRepository(FinancialTransaction);

  // Buscar todos os pedidos já pagos
  const paidOrders = await orderRepository.find({
    where: [
      { status: OrderStatus.PAID },
    ]
  });

  console.log(`Encontrados ${paidOrders.length} pedidos já pagos.`);

  let incomeCount = 0;
  let feeCount = 0;

  for (const order of paidOrders) {
    // Verifica se já existe transação para esse pedido
    const existing = await financialRepository.findOne({
      where: { referenceId: order.id, referenceType: ReferenceType.ORDER }
    });

    if (existing) {
      console.log(`Pedido #${order.id} já possui ledger. Pulando...`);
      continue;
    }

    const isPix = order.paymentMethod === PaymentMethod.PIX;
    const feeAmount = isPix ? 99 : 0; // Taxa de 0.99 para PIX InfinitPay MVP
    const dateToUse = order.paymentConfirmedAt || order.updatedAt || new Date();

    // Criar INCOME
    const income = financialRepository.create(new FinancialTransaction({
      referenceId: order.id,
      referenceType: ReferenceType.ORDER,
      type: TransactionType.INCOME,
      amount: order.total,
      status: TransactionStatus.SETTLED,
      paymentMethod: order.paymentMethod,
      provider: 'INFINITEPAY',
      expectedSettlementDate: dateToUse,
      settledAt: dateToUse,
      description: `Recebimento Pedido #${order.id} (Retroativo)`,
      createdAt: dateToUse,
      updatedAt: dateToUse
    }));
    await financialRepository.save(income);
    incomeCount++;

    // Criar FEE
    if (feeAmount > 0) {
      const fee = financialRepository.create(new FinancialTransaction({
        referenceId: order.id,
        referenceType: ReferenceType.ORDER,
        type: TransactionType.FEE,
        amount: feeAmount,
        status: TransactionStatus.SETTLED,
        paymentMethod: order.paymentMethod,
        provider: 'INFINITEPAY',
        expectedSettlementDate: dateToUse,
        settledAt: dateToUse,
        description: `Taxa InfinitePay Pedido #${order.id} (Retroativo)`,
        createdAt: dateToUse,
        updatedAt: dateToUse
      }));
      await financialRepository.save(fee);
      feeCount++;
    }
  }

  console.log(`\nSincronização Concluída!`);
  console.log(`- ${incomeCount} transações de Receita (INCOME) criadas.`);
  console.log(`- ${feeCount} transações de Taxas (FEE) criadas.`);

  process.exit(0);
}

populateLedger().catch(error => {
  console.error('Erro na sincronização:', error);
  process.exit(1);
});
