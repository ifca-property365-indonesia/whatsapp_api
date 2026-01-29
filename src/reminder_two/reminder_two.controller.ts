import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReminderTwoService } from './reminder_two.service';
import { ReminderTwoDto } from './dto/reminder_two.dto';

@Controller('reminder_two')
export class ReminderTwoController {
  constructor(private readonly ReminderTwoService: ReminderTwoService) {}

  @Post()
  dataReceive(@Body() ReminderDto: ReminderTwoDto) {
    return this.ReminderTwoService.dataReminder(ReminderDto);
  }

  @Post('/webhooks')
  async webhooks(@Body() data: Record<string, any>) {
    return this.ReminderTwoService.webhooks(data);
  }

  @Post('/worker')
  async worker(@Body() data: Record<string, any>) {
    return this.ReminderTwoService.worker(data);
  }
}
