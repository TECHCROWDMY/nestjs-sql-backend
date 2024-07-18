import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryItemDto } from './create-subcategory-item.dto';

export class UpdateSubcategoryItemDto extends PartialType(
  CreateSubcategoryItemDto,
) {}
