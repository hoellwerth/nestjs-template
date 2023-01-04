import { MailService } from './services/mail.service';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'postfix',
          host: configService.get<string>('MAIL_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: 'postmaster@sandboxaf04a5d2e77a420e8b153dc410575460.mailgun.org',
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
          tls: { rejectUnauthorized: false },
        },
        defaults: {
          from: '"No Reply" <noreply@test.eu>',
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
