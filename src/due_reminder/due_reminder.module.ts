import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DueReminderService } from './due_reminder.service';
import { DueReminderController } from './due_reminder.controller';
import { AccessCodeModule } from '../access_code/access_code.module';

@Module({
  controllers: [DueReminderController],
  providers: [DueReminderService],
  imports: [HttpModule, AccessCodeModule],
})
export class DueReminderModule {}
