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
}
