import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { RegisterService } from './services/register.service';
import { UserService } from './services/user.service';
import { UserStrategy } from '../auth/strategy/user.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { VerifyStrategy } from '../auth/strategy/verify.strategy';
import { SaltSchema } from './models/salt.model';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MailModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Salt', schema: SaltSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    RegisterService,
    UserService,
    VerifyStrategy,
    UserStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
