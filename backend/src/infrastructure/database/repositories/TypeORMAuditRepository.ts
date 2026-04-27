// src/infrastructure/database/repositories/TypeORMAuditRepository.ts
import { Repository } from "typeorm";
import { IAuditRepository } from "@core/interfaces/IAuditRepository";
import { AuditLogModel } from "../models/AuditLogModel";

export class TypeORMAuditRepository implements IAuditRepository {
    constructor(
        private readonly ormRepository: Repository<AuditLogModel>
    ) {}

    async saveEvent(data: any): Promise<void> {
        const logEntry = this.ormRepository.create({
            ...data,
            timestamp: new Date()
        });
        await this.ormRepository.save(logEntry);
    }

    async saveLog(data: {
        userId?: number;
        action: string;
        entity: string;
        entityId?: string;
        oldValue?: string;
        newValue?: string;
        ip?: string;
        userAgent?: string;
    }): Promise<void> {
        const logEntry = this.ormRepository.create({
            userId: data.userId,
            action: data.action,
            entity: data.entity,
            entityId: data.entityId,
            oldValue: data.oldValue,
            newValue: data.newValue,
            ip: data.ip,
            userAgent: data.userAgent,
            createdAt: new Date()
        });
        await this.ormRepository.save(logEntry);
    }
}