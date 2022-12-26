import { Module } from '@nestjs/common';
import { LogService } from './services/log.service';

@Module({
  providers: [LogService],
})
export class LogModule {}
