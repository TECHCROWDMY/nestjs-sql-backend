// subcategory-item.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';

@Entity()
export class SubcategoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  parent: string;

  @Column()
  subcategoryId: string;

  @ManyToOne(() => Subcategory)
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Subcategory;
}
