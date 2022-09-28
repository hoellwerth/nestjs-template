import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:3YwLc0aWQv6HwAD1@nestjs-template.zclbqcf.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'test' },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
