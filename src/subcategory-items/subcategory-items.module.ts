import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryItemsService } from './subcategory-items.service';
import { SubcategoryItemsController } from './subcategory-items.controller';
import { SubcategoryItem } from './entities/subcategory-item.entity';
import { Subcategory } from '../subcategories/entities/subcategory.entity'; // Import Subcategory entity
import { SubcategoriesModule } from '../subcategories/subcategories.module'; // Import SubcategoriesModule

@Module({
  imports: [
    TypeOrmModule.forFeature([SubcategoryItem, Subcategory]),
    SubcategoriesModule, // Import SubcategoriesModule
  ],
  controllers: [SubcategoryItemsController],
  providers: [SubcategoryItemsService],
})
export class SubcategoryItemsModule {}
