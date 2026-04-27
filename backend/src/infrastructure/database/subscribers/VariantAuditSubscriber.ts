import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { ProductVariant } from "@core/domain/ProductVariant";
import { VariantHistorySchema } from "../mappers/VariantHistorySchema";

@EventSubscriber()
export class VariantAuditSubscriber implements EntitySubscriberInterface<ProductVariant> {
    
    // O TypeORM usará a classe ProductVariant vinculada ao seu Schema
    listenTo() {
        return ProductVariant;
    }

    async afterUpdate(event: UpdateEvent<ProductVariant>) {
        // Usamos o Schema para obter o repositório de log
        const repo = event.manager.getRepository(VariantHistorySchema);
        
        // Comparamos o estado do banco (databaseEntity) com o novo estado (entity)
        const stockChanged = event.databaseEntity.stock !== event.entity?.stock;
        const priceChanged = event.databaseEntity.price !== event.entity?.price;

        if (stockChanged || priceChanged) {
            await repo.save({
                sku: event.databaseEntity.sku,
                action: 'UPDATE',
                oldPrice: event.databaseEntity.price,
                newPrice: event.entity?.price ?? event.databaseEntity.price,
                oldStock: event.databaseEntity.stock,
                newStock: event.entity?.stock ?? event.databaseEntity.stock,
                changedBy: 'system'
            });
        }
    }
}