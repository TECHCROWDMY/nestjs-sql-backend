import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { SubcategoryItem } from 'src/subcategory-items/entities/subcategory-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, SubcategoryItem])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
