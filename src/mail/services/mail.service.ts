import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../../../forum-echo/backend/src/modules/users/models/user.model';
import * as dotenv from 'dotenv';

dotenv.config({
  path: 'src/modules/environment/config/dev.env',
});

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User): Promise<void> {
    const url = `${process.env.DOMAIN}verify/${user.role}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to ForumEcho! Confirm your Email',
      template: './confirmation.hbs',
      context: {
        name: user.username,
        url,
      },
    });
  }

  async sendUserInformation(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Login to your ForumEcho account',
      template: './information.hbs',
      context: {
        name: user.username,
      },
    });
  }

  async sendForgetPassword(user: User | any, token: string): Promise<void> {
    const url = `${process.env.DOMAIN}reset/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: './password.hbs',
      context: {
        url,
        name: user.username,
      },
    });
  }

  async sendPasswordInfo(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Information',
      template: './password-info.hbs',
      context: {
        name: user.username,
      },
    });
  }
}
