import { Module } from '@nestjs/common';
import { AccessCodeService } from './access_code.service';
import { AccessCodeController } from './access_code.controller';

@Module({
  controllers: [AccessCodeController],
  providers: [AccessCodeService],
  exports: [AccessCodeService],
})
export class AccessCodeModule {}
