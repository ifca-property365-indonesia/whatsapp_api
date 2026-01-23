import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderDto } from './dto/reminder.dto';

@Controller('reminder')
export class ReminderController {
  constructor(private readonly ReminderService: ReminderService) {}

  @Post()
  dataReceive(@Body() ReminderDto: ReminderDto) {
    return this.ReminderService.dataReminder(ReminderDto);
  }

  @Post('/webhooks')
  async webhooks(@Body() data: Record<string, any>) {
    return this.ReminderService.webhooks(data);
  }

  @Post('/worker')
  async worker(@Body() data: Record<string, any>) {
    return this.ReminderService.worker(data);
  }
}
