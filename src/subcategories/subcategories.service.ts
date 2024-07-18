import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async create(
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    const newSubcategory =
      this.subcategoryRepository.create(createSubcategoryDto);
    return await this.subcategoryRepository.save(newSubcategory);
  }

  async findAll(): Promise<Subcategory[]> {
    return await this.subcategoryRepository.find();
  }

  async findOne(id: string): Promise<Subcategory> {
    const category = await this.subcategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    await this.subcategoryRepository.update(id, updateSubcategoryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subcategoryRepository.delete(id);
  }
}
