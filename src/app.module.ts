import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiveModule } from './receive/receive.module';
import { HomeModule } from './home/home.module';
import { AccessCodeModule } from './access_code/access_code.module';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HomeModule,
    ReceiveModule,
    AccessCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}