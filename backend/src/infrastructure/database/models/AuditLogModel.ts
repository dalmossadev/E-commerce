// src/infrastructure/database/models/AuditLogModel.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity("audit_logs") // Nome da tabela no MySQL
export class AuditLogModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  userId!: number;

  @Column()
  action!: string; // INSERT, UPDATE, DELETE, LOGIN_SUCCESS... [cite: 13]

  @Column({ nullable: true })
  entity!: string; // Ex: 'Product' [cite: 9]

  @Column({ nullable: true })
  entityId!: string;

  @Column({ type: "json", nullable: true })
  oldValue: any; // Snapshot antes da alteração [cite: 10]

  @Column({ type: "json", nullable: true })
  newValue: any; // Snapshot depois da alteração [cite: 9]

  @Column({ nullable: true })
  ip!: string;

  @Column({ nullable: true })
  userAgent!: string;

  @CreateDateColumn()
  createdAt!: Date;
}