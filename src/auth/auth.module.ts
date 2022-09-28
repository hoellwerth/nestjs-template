import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServicesService } from './services/services.service';

@Module({
  controllers: [AuthController],
  providers: [ServicesService],
})
export class AuthModule {}
