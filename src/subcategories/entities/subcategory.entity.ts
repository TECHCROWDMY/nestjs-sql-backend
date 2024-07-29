import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { SubcategoryItem } from 'src/subcategory-items/entities/subcategory-item.entity';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(
    () => SubcategoryItem,
    (subcategoryItem) => subcategoryItem.subcategory,
  )
  subcategoryItems: SubcategoryItem[];
}
