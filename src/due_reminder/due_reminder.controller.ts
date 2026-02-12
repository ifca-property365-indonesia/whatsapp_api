import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DueReminderService } from './due_reminder.service';
import { DueReminderDto } from './dto/due_reminder.dto';

@Controller('due_reminder')
export class DueReminderController {
  constructor(private readonly DueReminderService: DueReminderService) {}

  @Post()
  dataReceive(@Body() DueReminderDto: DueReminderDto) {
    return this.DueReminderService.dataDueReminder(DueReminderDto);
  }

  @Post('/webhooks')
  async webhooks(@Body() data: Record<string, any>) {
    return this.DueReminderService.webhooks(data);
  }

  @Post('/worker')
  async worker(@Body() data: Record<string, any>) {
    return this.DueReminderService.worker(data);
  }
}
