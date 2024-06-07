import { Controller, Get, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('heal-check')
  async healCheck() {}
}
