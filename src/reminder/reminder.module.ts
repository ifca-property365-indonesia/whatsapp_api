import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { AccessCodeModule } from '../access_code/access_code.module';

@Module({
  controllers: [ReminderController],
  providers: [ReminderService],
  imports: [HttpModule, AccessCodeModule],
})
export class ReminderModule {}
