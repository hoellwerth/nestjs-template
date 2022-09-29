import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { SaltSchema } from './models/salt.model';
import { RegisterService } from './services/register.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Salt', schema: SaltSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, RegisterService],
  exports: [UserService],
})
export class UserModule {}
