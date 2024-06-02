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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOauthGuard } from './google-oauth.guard';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { MailchimpService } from 'src/mailchimp/mailchimp.service';

@Controller('auth')
export class AuthController {
  usersService: UsersService;
  constructor(
    private authService: AuthService,
    private mailChimpService: MailchimpService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ message: string; token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
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

  // @Get('send-verification-email')
  // async verifyEmail(@Query('token') token: string): Promise<string> {
  //   const payload = await this.authService.verifyToken(token);
  //   const email = payload.email;

  //   try {
  //     await this.usersService.verifyUser(email);
  //     return 'Email verified successfully';
  //   } catch (err) {
  //     throw new BadRequestException('Invalid token');
  //   }
  // }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    const result = await this.authService.verifyEmail(token);
    if (result) {
      return res.redirect('/email-verified'); // Redirect to a confirmation page
    } else {
      return res.redirect('/email-verification-failed'); // Redirect to an error page
    }
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
  async sendEmail() {
    return this.mailChimpService.sendEmail('thilak014@gmail.com', 'test');
  }
}
