import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

Entity({ name: 'users' });
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ nullable: true })
  authStrategy: string;
}
