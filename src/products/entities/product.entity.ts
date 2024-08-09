import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductImage } from 'src/product-images/entities/product-image.entity';
import { Stock } from 'src/stock/entities/stock.entity';

export enum ProductStatus {
  ACTIVE = 'Active',
  DRAFT = 'Draft',
  INACTIVE = 'InActive',
}

export enum ProductType {
  STATIC = 'Static',
  DYNAMIC = 'Dynamic',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  productStatus: ProductStatus;

  @Column()
  name: string;

  @OneToMany(() => ProductImage, (productImages) => productImages.product, {
    cascade: true,
  })
  images: ProductImage[];

  @Column({ nullable: true })
  threeDModel?: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.STATIC,
  })
  productType: ProductType;

  @Column()
  category: string;

  @Column({ type: 'boolean', default: false })
  modelSize: boolean;

  @Column()
  productFitting: 'True to Size' | 'Runs Small' | 'Runs Big';

  @Column('simple-array')
  productSizes: string[];

  @Column('simple-array')
  productColors: string[];

  @Column()
  productMaterial: string;

  @Column({ type: 'boolean', default: false })
  productDimensions: boolean;

  @Column({ type: 'boolean', default: false })
  productSizechart: boolean;

  @Column({ nullable: true })
  productInsurance?: string;

  @Column({ type: 'text' })
  productDescription: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float', nullable: true })
  strikethroughPrice?: number;

  @Column({ type: 'boolean', default: false })
  chargeTax: boolean;

  @Column({ type: 'float' })
  costPerProduct: number;

  @Column({ type: 'float' })
  profit: number;

  @Column({ type: 'float' })
  margin: number;

  @OneToMany(() => Stock, (stock) => stock.product, {
    cascade: true,
  })
  stocks: Stock[];
}
