import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

export const QUEUE = {
  WELCOME: 'WELCOME',
  NEW_CONFIRM_EMAIL_CODE: 'NEW_CONFIRM_EMAIL_CODE',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
};

export type QUEUE = (typeof QUEUE)[keyof typeof QUEUE];

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE.WELCOME) public queueWelcome: Queue,
    @InjectQueue(QUEUE.NEW_CONFIRM_EMAIL_CODE) public queueNewEmailConfirmationCode: Queue, // prettier-ignore
    @InjectQueue(QUEUE.FORGOT_PASSWORD) public queueForgotPassword: Queue,
  ) {}
}
