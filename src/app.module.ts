import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiveModule } from './receive/receive.module';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReceiveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}