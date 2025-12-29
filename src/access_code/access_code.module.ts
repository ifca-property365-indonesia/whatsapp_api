import { Module } from '@nestjs/common';
import { AccessCodeService } from './access_code.service';
import { AccessCodeController } from './access_code.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AccessCodeController],
  providers: [AccessCodeService],
  exports: [AccessCodeService],
  imports: [DatabaseModule],
})
export class AccessCodeModule {}
