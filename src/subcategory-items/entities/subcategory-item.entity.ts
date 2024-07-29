// subcategory-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';

@Entity()
export class SubcategoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  parent?: string;

  @Column()
  subcategoryId: string;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.subcategoryItems)
  subcategory: Subcategory;
}
