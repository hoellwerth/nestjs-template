import { MailService } from './services/mail.service';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

dotenv.config({
  path: 'src/modules/environment/config/dev.env',
});

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.eu.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: 'postmaster@mail.forumecho.eu',
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@forumecho.eu>',
      },
      template: {
        dir: join(__dirname, '../templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
