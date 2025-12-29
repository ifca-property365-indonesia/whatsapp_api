import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceiveService } from './receive.service';
import { ReceiveDto } from './dto/receive.dto';

@Controller('receive')
export class ReceiveController {
  constructor(private readonly ReceiveService: ReceiveService) {}

  @Post()
  dataReceive(@Body() receiveDto: ReceiveDto) {
    return this.ReceiveService.dataReceive(receiveDto);
  }

  @Post('/webhooks')
  async webhooks(@Body() data: Record<string, any>) {
    return this.ReceiveService.webhooks(data);
  }

  @Post('/worker')
  async worker(@Body() data: Record<string, any>) {
    return this.ReceiveService.worker(data);
  }
}
