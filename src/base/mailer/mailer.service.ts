import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { config } from '@/config';
import { LoggerService } from '@base/logger';
import { BadRequest } from '../api/exception.reslover';
@Injectable()
export class MailerService {
  private transporter: any;

  constructor(private readonly loggerService: LoggerService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL,
        pass: config.MAIL_PASSWORD,
      },
    });
  }

  logger = this.loggerService.getLogger(MailerService.name);

  async sendMail(to: string, subject: string, body: string) {
    try {
      const mailOptions = {
        from: config.EMAIL,
        to,
        subject,
        html: body,
      };
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (e) {
      this.logger.warn(e);
      return new BadRequestException();
    }
  }
}
