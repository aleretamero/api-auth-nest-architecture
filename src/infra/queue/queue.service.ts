import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

export const QUEUE = {
  WELCOME: 'WELCOME',
  NEW_CONFIRM_EMAIL_CODE: 'NEW_CONFIRM_EMAIL_CODE',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CREATE_USER: 'CREATE_USER',
};

export type QUEUE = (typeof QUEUE)[keyof typeof QUEUE];

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE.WELCOME) public welcome: Queue,
    @InjectQueue(QUEUE.NEW_CONFIRM_EMAIL_CODE) public newEmailConfirmationCode: Queue, // prettier-ignore
    @InjectQueue(QUEUE.FORGOT_PASSWORD) public forgotPassword: Queue,
    @InjectQueue(QUEUE.CREATE_USER) public createUser: Queue,
  ) {}
}
