import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'src/environment/dev.env' });

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, { dbName: 'test' }),
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
