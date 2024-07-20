import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubcategoryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  parent?: string;

  @IsString()
  @IsNotEmpty()
  subcategoryId: string;
}
