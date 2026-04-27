// src/core/interfaces/IAuditRepository.ts
import { AuthEvent } from "@core/domain/AuditLog";

export interface IAuditRepository {
    saveEvent(data: {
        userId?: string;
        event: AuthEvent;
        ip: string;
        userAgent: string;
        details?: string;
    }): Promise<void>;

    saveLog(data: {
        userId?: number;
        action: string;
        entity: string;
        entityId?: string;
        oldValue?: string;
        newValue?: string;
        ip?: string;
        userAgent?: string;
    }): Promise<void>;
}