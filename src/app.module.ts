import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { GoogleStrategy } from './auth/google.strategy';
import { MailchimpModule } from './mailchimp/mailchimp.module';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';
import { CompaniesModule } from './companies/companies.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { SubcategoryItemsModule } from './subcategory-items/subcategory-items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: 'sympspace',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    CategoriesModule,
    OrdersModule,
    AuthModule,
    MailchimpModule,
    EmailModule,
    ProductsModule,
    CompaniesModule,
    SubcategoriesModule,
    SubcategoryItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
