import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from '../users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity'; // Import the Company entity
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtGuard } from './jwt-auth.guard';
import { GitHubStrategy } from './github.strategy';
import { AppleStrategy } from './apple.strategy';
import { MailchimpModule } from '../mailchimp/mailchimp.module';
import { UsersModule } from '../users/users.module'; // Import the UsersModule

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: 1500,
          },
        };
      },
    }),
    UsersModule,
    MailchimpModule,
    TypeOrmModule.forFeature([User, Company]), // Include Company entity here
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtGuard,
    GoogleStrategy,
    GitHubStrategy,
    AppleStrategy,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
