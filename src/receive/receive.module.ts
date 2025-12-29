import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReceiveService } from './receive.service';
import { ReceiveController } from './receive.controller';
import { AccessCodeModule } from '../access_code/access_code.module';

@Module({
  controllers: [ReceiveController],
  providers: [ReceiveService],
  imports: [HttpModule, AccessCodeModule],
})
export class ReceiveModule {}
