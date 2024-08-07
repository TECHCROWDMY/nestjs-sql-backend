import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { SubcategoryItem } from 'src/subcategory-items/entities/subcategory-item.entity';
import { categoriesSeedData } from './category/data';
import { blogSeedData } from './blog/data';
import { Blog } from 'src/blogs/entities/blog.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(SubcategoryItem)
    private readonly subcategoryItemRepository: Repository<SubcategoryItem>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async seed() {
    await this.clear();

    //SEED CATEGORIES
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
            subcategory,
          });
          await this.subcategoryItemRepository.save(subcategoryItem);
        }
      }
    }

    //SEED BLOGS
    for (const blog of blogSeedData) {
      const existingBlog = await this.blogRepository.findOne({
        where: { slug: blog.slug },
      });
      if (!existingBlog) {
        const newBlog = this.blogRepository.create(blog);
        await this.blogRepository.save(newBlog);
      }
    }
  }

  async clear() {
    await this.subcategoryItemRepository.delete({});
    await this.subcategoryRepository.delete({});
    await this.categoryRepository.delete({});
    await this.blogRepository.delete({});
  }
}
