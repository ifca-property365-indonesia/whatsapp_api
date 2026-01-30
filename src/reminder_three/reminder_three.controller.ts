import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReminderThreeService } from './reminder_three.service';
import { ReminderThreeDto } from './dto/reminder_three.dto';

@Controller('reminder_three')
export class ReminderThreeController {
  constructor(private readonly ReminderThreeService: ReminderThreeService) {}

  @Post()
  dataReceive(@Body() ReminderDto: ReminderThreeDto) {
    return this.ReminderThreeService.dataReminder(ReminderDto);
  }

  @Post('/webhooks')
  async webhooks(@Body() data: Record<string, any>) {
    return this.ReminderThreeService.webhooks(data);
  }

  @Post('/worker')
  async worker(@Body() data: Record<string, any>) {
    return this.ReminderThreeService.worker(data);
  }
}
