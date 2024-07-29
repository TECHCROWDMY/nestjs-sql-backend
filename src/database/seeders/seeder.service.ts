import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { SubcategoryItem } from 'src/subcategory-items/entities/subcategory-item.entity';
import { categoriesSeedData } from './category/data';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(SubcategoryItem)
    private readonly subcategoryItemRepository: Repository<SubcategoryItem>,
  ) {}

  async seed() {
    await this.clear();

    for (const categoryData of categoriesSeedData) {
      const category = this.categoryRepository.create({
        name: categoryData.name,
      });
      await this.categoryRepository.save(category);

      for (const subcategoryData of categoryData.subcategories) {
        const subcategory = this.subcategoryRepository.create({
          name: subcategoryData.name,
          category,
        });
        await this.subcategoryRepository.save(subcategory);

        for (const subcategoryItemData of subcategoryData.subcategoryItems) {
          const subcategoryItem = this.subcategoryItemRepository.create({
            name: subcategoryItemData.name,
            parent: subcategoryItemData.parent,
            subcategory,
          });
          await this.subcategoryItemRepository.save(subcategoryItem);
        }
      }
    }
  }

  async clear() {
    await this.subcategoryItemRepository.delete({});
    await this.subcategoryRepository.delete({});
    await this.categoryRepository.delete({});
  }
}
