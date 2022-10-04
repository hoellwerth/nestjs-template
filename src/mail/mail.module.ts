import { MailService } from './services/mail.service';
import { Module } from '@nestjs/common';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

dotenv.config({
  path: 'src/modules/environment/config/dev.env',
});

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'postfix',
        host: '83.215.54.212',
        port: 8025,
        secure: false,
        auth: {
          user: 'noreply@baumistlustig.eu',
          pass: process.env.MAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
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
