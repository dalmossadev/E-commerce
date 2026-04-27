import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AuditBase {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    action!: 'INSERT' | 'UPDATE' | 'DELETE';

    @Column({ nullable: true })
    changedBy!: string; // ID do usuário

    @CreateDateColumn()
    createdAt!: Date;
}