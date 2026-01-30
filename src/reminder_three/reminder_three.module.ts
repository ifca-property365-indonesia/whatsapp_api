import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReminderThreeService } from './reminder_three.service';
import { ReminderThreeController } from './reminder_three.controller';
import { AccessCodeModule } from '../access_code/access_code.module';

@Module({
  controllers: [ReminderThreeController],
  providers: [ReminderThreeService],
  imports: [HttpModule, AccessCodeModule],
})
export class ReminderThreeModule {}
