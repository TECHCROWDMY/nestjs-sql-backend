import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';

@Entity()
@Unique(['slug'])
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column('text')
  @IsNotEmpty()
  @IsString()
  content: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  newsType: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  author: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  handle_url: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  handle_url_title: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  article_source_url: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  tag: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
