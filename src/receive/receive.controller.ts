import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceiveService } from './receive.service';
import { ReceiveDto } from './dto/receive.dto';

@Controller('receive')
export class ReceiveController {
  constructor(private readonly receiveService: ReceiveService) {}

  @Post()
  create(@Body() receiveDto: ReceiveDto) {
    return this.receiveService.dataReceive(receiveDto);
  }
}
