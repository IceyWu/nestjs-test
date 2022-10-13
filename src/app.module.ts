import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpiderModule } from './spider/spider.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [SpiderModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
