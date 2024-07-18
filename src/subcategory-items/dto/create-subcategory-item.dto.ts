import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubcategoryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  parent: string;

  @IsString()
  @IsNotEmpty()
  subcategoryId: string;
}
