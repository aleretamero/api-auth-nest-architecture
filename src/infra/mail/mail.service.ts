import { Injectable } from '@nestjs/common';
import {
  MailerService as NestMailService,
  ISendMailOptions,
} from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: NestMailService) {}

  async sendMail(mailOptions: ISendMailOptions): Promise<void> {
    await this.mailerService.sendMail(mailOptions);
  }
}
