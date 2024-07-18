import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubcategoryItemsService } from './subcategory-items.service';
import { CreateSubcategoryItemDto } from './dto/create-subcategory-item.dto';
import { UpdateSubcategoryItemDto } from './dto/update-subcategory-item.dto';

@Controller('subcategory-items')
export class SubcategoryItemsController {
  constructor(
    private readonly subcategoryItemsService: SubcategoryItemsService,
  ) {}

  @Post()
  create(@Body() createSubcategoryItemDto: CreateSubcategoryItemDto) {
    return this.subcategoryItemsService.create(createSubcategoryItemDto);
  }

  @Get()
  findAll() {
    return this.subcategoryItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryItemsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryItemDto: UpdateSubcategoryItemDto,
  ) {
    return this.subcategoryItemsService.update(id, updateSubcategoryItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryItemsService.remove(id);
  }
}
