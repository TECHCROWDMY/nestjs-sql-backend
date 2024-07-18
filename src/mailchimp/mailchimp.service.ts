import { Injectable, Logger } from '@nestjs/common';
import * as Mailchimp from '@mailchimp/mailchimp_marketing';
import * as MailchimpTransactional from '@mailchimp/mailchimp_transactional';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailchimpService {
  private readonly logger = new Logger(MailchimpService.name);
  private readonly transactionalClient;

  constructor(private readonly configService: ConfigService) {
    Mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX,
    });

    this.transactionalClient = MailchimpTransactional(
      process.env.MAILCHIMP_TRANSACTIONAL_API_KEY,
    );
  }

  async addOrUpdateMember(email: string) {
    try {
      const response = await Mailchimp.lists.setListMember(
        process.env.MAILCHIMP_LIST_ID,
        email,
        {
          email_address: email,
          status_if_new: 'pending',
        },
      );
      return response;
    } catch (error) {
      this.logger.error(`Failed to add or update member: ${error.message}`);
      throw error;
    }
  }

  async sendVerificationEmail(email: string, verificationUrl: string) {
    try {
      const response = await this.transactionalClient.messages.send({
        key: process.env.MAILCHIMP_TRANSACTIONAL_API_KEY,
        message: {
          from_email: 'contact@symspacelabs.com',
          subject: 'Verify your email address',
          to: [{ email, type: 'to' }],
          html: `<p>Please verify your email by clicking the following link:</p></br><a href="${verificationUrl}">Click here</a>`,
        },
      });
      return response;
    } catch (error) {
      this.logger.error(`Failed to send verification email: ${error.message}`);
      throw error;
    }
  }

  async sendEmail(email: string, verificationUrl: string) {
    try {
      const response = await this.transactionalClient.messages.send({
        key: process.env.MAILCHIMP_TRANSACTIONAL_API_KEY,
        message: {
          from_email: 'contact@symspacelabs.com',
          subject: 'Verify your email address',
          to: [{ email, type: 'to' }],
          html: `<p>Please verify your email by clicking the following link:</p></br><a href="${verificationUrl}">Click here</a>`,
        },
      });
      return response;
    } catch (error) {
      this.logger.error(`Failed to send verification email: ${error.message}`);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(resetUrl);

    const message = {
      from_email: 'your-email@example.com',
      subject: 'Password Reset',
      html: `Please reset your password by clicking the following link: <a href="${resetUrl}">Reset Password</a>`,
      to: [
        {
          email,
          type: 'to',
        },
      ],
    };

    try {
      console.error(resetUrl);
      await this.transactionalClient.messages.send({ message });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }
}
