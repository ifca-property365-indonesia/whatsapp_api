import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReceiveService } from './receive.service';
import { ReceiveController } from './receive.controller';

@Module({
  controllers: [ReceiveController],
  providers: [ReceiveService],
  imports: [HttpModule],
})
export class ReceiveModule {}
