import { Injectable } from '@nestjs/common';
import {
  MailerOptions,
  MailerService,
  MailerTransportFactory,
} from '@nestjs-modules/mailer';

@Injectable()
export class MailService extends MailerService {
  constructor(
    mailerOptions: MailerOptions,
    transportFactory: MailerTransportFactory,
  ) {
    super(mailerOptions, transportFactory);
  }
}
