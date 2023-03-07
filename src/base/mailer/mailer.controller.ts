import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MailerService } from '@base/mailer/mailer.service';

@Controller('mailer')
@ApiTags('Mailer')
export class MailerController {
  constructor(private readonly mailService: MailerService) {}
}
