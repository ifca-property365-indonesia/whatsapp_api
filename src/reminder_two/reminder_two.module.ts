import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReminderTwoService } from './reminder_two.service';
import { ReminderTwoController } from './reminder_two.controller';
import { AccessCodeModule } from '../access_code/access_code.module';

@Module({
  controllers: [ReminderTwoController],
  providers: [ReminderTwoService],
  imports: [HttpModule, AccessCodeModule],
})
export class ReminderTwoModule {}
