import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  Req,
  Get,
  HttpStatus,
  Query,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOauthGuard } from './google-oauth.guard';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { MailchimpService } from 'src/mailchimp/mailchimp.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  usersService: UsersService;
  constructor(
    private authService: AuthService,
    private mailChimpService: MailchimpService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const result = await this.authService.signUp(signUpDto);
    if (result.token) {
      return res.status(HttpStatus.CREATED).json(result);
    } else {
      return res.status(HttpStatus.CONFLICT).json(result);
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    const { role } = this.jwtService.verify(token);
    try {
      await this.authService.verifyEmail(token);
      let redirectUrl;
      if (role === 'seller') {
        redirectUrl = `${process.env.FRONTEND_URL}/vendor/dashboard`;
      } else {
        redirectUrl = `${process.env.FRONTEND_URL}/marketplace`;
      }

      return res.redirect(redirectUrl);
    } catch (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/email-verification-failed`,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const token = await this.authService.oAuthLogin(req);
      res.redirect(`${process.env.FRONTEND_URL}/?token=${token.jwt}`);
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/callback/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // initiates the GitHub OAuth2 login flow
  }

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect(@Req() req, @Res() res: Response) {
    const { user, accessToken } = req.user;
    const frontendRedirectUrl = `${process.env.FRONTEND_URL}/auth/callback?user=${encodeURIComponent(
      JSON.stringify(user),
    )}&accessToken=${accessToken}`;
    return res.redirect(frontendRedirectUrl);
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth() {
    // Initiates the Apple OAuth2 login flow
  }

  @Get('/callback/apple')
  @UseGuards(AuthGuard('apple'))
  appleAuthRedirect(@Req() req, @Res() res: Response) {
    const { user, accessToken } = req.user;
    // const accessToken = user.accessToken;

    const frontendRedirectUrl = `${process.env.FRONTEND_URL}/auth/callback?user=${encodeURIComponent(
      JSON.stringify(user),
    )}&accessToken=${accessToken}`;
    return res.redirect(frontendRedirectUrl);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.authService.generateResetToken(email);
      return {
        message: 'Password reset url has been sent to your email',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.authService.resetPassword(token, newPassword);
      return {
        message: 'Password reset successful!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/send-email')
  async sendEmail(
    @Body('email') email: string,
    @Body('verificationUrl') verificationUrl: string,
  ) {
    return this.mailChimpService.sendEmail(email, verificationUrl);
  }
}
