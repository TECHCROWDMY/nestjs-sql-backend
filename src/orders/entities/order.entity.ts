// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { User } from './user.entity'; // Assuming there's a User entity
// import { Product } from 'src/products/entities/product.entity';

// export enum PaymentStatus {
//   PENDING = 'Pending',
//   COMPLETED = 'Completed',
//   FAILED = 'Failed',
// }

// export enum PaymentMethod {
//   CREDIT_CARD = 'Credit Card',
//   PAYPAL = 'PayPal',
//   BANK_TRANSFER = 'Bank Transfer',
// }

// @Entity()
export class Order {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;
  // @Column({ type: 'float' })
  // totalAmount: number;
  // @Column({
  //   type: 'enum',
  //   enum: PaymentStatus,
  //   default: PaymentStatus.PENDING,
  // })
  // paymentStatus: PaymentStatus;
  // @Column({
  //   type: 'enum',
  //   enum: PaymentMethod,
  // })
  // paymentMethod: PaymentMethod;
  // @ManyToOne(() => User, user => user.orders)
  // user: User;
  // @Column({ type: 'string', length: 9 })
  // productStockId: string;
  // @CreateDateColumn()
  // dateCreated: Date;
  // @UpdateDateColumn()
  // dateUpdated: Date;
}
