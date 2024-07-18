import {
  Injectable,
  UnauthorizedException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MailchimpService } from '../mailchimp/mailchimp.service';
// import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
// import { UsersService } from 'src/users/users.service';
// import { MailchimpService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mailchimpService: MailchimpService,
    // private readonly usersService: UsersService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; token?: string }> {
    const { firstName, lastName, email, password, role = 'buyer' } = signUpDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return { message: 'Email already exists. Please use a different email.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await this.usersRepository.save(user);

    const token = this.jwtService.sign(
      { userId: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );

    // Construct verification URL
    const verificationUrl = `${process.env.BACKEND_URL}/auth/verify-email?token=${token}`;

    await this.mailchimpService.sendVerificationEmail(email, verificationUrl);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User Info from Google',
      user: req.user,
    };
  }

  async oAuthLogin(req: any) {
    if (!req.user) {
      throw new Error('User not found!!!');
    }

    const payload = {
      email: req.user.email,
      name: req.user.name,
    };

    const jwt = await this.jwtService.sign(payload);

    return { jwt };
  }

  async generateVerificationToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      // Verify and decode the token
      const { email } = this.jwtService.verify(token);

      // Find the user by email
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      // Activate the user
      user.isVerified = true;
      await this.usersRepository.save(user);

      return true;
    } catch (error) {
      this.logger.error(`Email verification failed: ${error.message}`);
      return false;
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await this.mailchimpService.sendPasswordResetEmail(user.email, token);
  }

  async generateResetToken(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await this.usersRepository.save(user);

    await this.mailchimpService.sendPasswordResetEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { resetToken: token },
    });
    if (!user || user.resetTokenExpiry < new Date()) {
      throw new Error('Token is invalid or expired');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await this.usersRepository.save(user);
  }
}
