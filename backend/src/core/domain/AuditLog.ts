// src/core/domain/AuditLog.ts
import { User } from './User';

// EXPORTAR O ENUM AQUI:
export enum AuthEvent {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT'
}

export class AuditLog {
  public id!: number;
  public userId?: number;    // Tornamos opcional para suportar LOGIN_FAILURE 
  public action!: string;    // INSERT, UPDATE, DELETE ou LOGIN_SUCCESS... 
  public entity!: string;    // Product, Settings ou Auth 
  public entityId?: string; 
  public oldValue?: string;  
  public newValue?: string;  
  public ip?: string;        // Para detecção de força bruta 
  public userAgent?: string; // Para rastreio de atividade legítima 
  public createdAt!: Date;
  public user?: User;

  constructor(props: Partial<AuditLog>) {
    Object.assign(this, props);
    this.createdAt = this.createdAt || new Date();
  }
}