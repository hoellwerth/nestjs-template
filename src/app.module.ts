import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:3YwLc0aWQv6HwAD1@nestjs-template.zclbqcf.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'test' },
    ),
    MailModule,
    AuthModule,
    UserModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
