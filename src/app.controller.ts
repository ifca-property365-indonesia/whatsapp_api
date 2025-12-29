import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly AppService: AppService) {}

  @Get()
  @Redirect('/api-documentation', 302)
  @ApiExcludeEndpoint()
  redirectToSwagger() {}
}
