import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubcategoryItemDto } from './dto/create-subcategory-item.dto';
import { UpdateSubcategoryItemDto } from './dto/update-subcategory-item.dto';
import { SubcategoryItem } from './entities/subcategory-item.entity';
import { Subcategory } from '../subcategories/entities/subcategory.entity';

@Injectable()
export class SubcategoryItemsService {
  constructor(
    @InjectRepository(SubcategoryItem)
    private subcategoryItemsRepository: Repository<SubcategoryItem>,
    @InjectRepository(Subcategory)
    private subcategoriesRepository: Repository<Subcategory>,
  ) {}

  async create(
    createSubcategoryItemDto: CreateSubcategoryItemDto,
  ): Promise<SubcategoryItem> {
    const subcategory = await this.subcategoriesRepository.findOne({
      where: { id: createSubcategoryItemDto.subcategoryId },
    });
    if (!subcategory) {
      throw new NotFoundException(
        `Subcategory with ID ${createSubcategoryItemDto.subcategoryId} not found`,
      );
    }

    const subcategoryItem = this.subcategoryItemsRepository.create({
      ...createSubcategoryItemDto,
      subcategory,
    });

    return await this.subcategoryItemsRepository.save(subcategoryItem);
  }

  async findAll(): Promise<SubcategoryItem[]> {
    return await this.subcategoryItemsRepository.find({
      relations: ['subcategory'],
    });
  }

  async findOne(id: string): Promise<SubcategoryItem> {
    const subcategoryItem = await this.subcategoryItemsRepository.findOne({
      where: { id },
      relations: ['subcategory'],
    });
    if (!subcategoryItem) {
      throw new NotFoundException(`SubcategoryItem with ID ${id} not found`);
    }
    return subcategoryItem;
  }

  async update(
    id: string,
    updateSubcategoryItemDto: UpdateSubcategoryItemDto,
  ): Promise<SubcategoryItem> {
    const subcategoryItem = await this.subcategoryItemsRepository.preload({
      id,
      ...updateSubcategoryItemDto,
    });
    if (!subcategoryItem) {
      throw new NotFoundException(`SubcategoryItem with ID ${id} not found`);
    }
    return await this.subcategoryItemsRepository.save(subcategoryItem);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.subcategoryItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SubcategoryItem with ID ${id} not found`);
    }
    return {
      message: `SubcategoryItem with ID ${id} has been successfully deleted`,
    };
  }
}
