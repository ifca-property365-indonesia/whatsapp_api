import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccessCodeService } from './access_code.service';

@Controller('access-code')
export class AccessCodeController {
  constructor(private readonly accessCodeService: AccessCodeService) {}


}
