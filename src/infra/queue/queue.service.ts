import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

export const QUEUE = {
  WELCOME: 'WELCOME',
  SEND_CONFIRMATION_ACCOUNT: 'SEND_CONFIRMATION_ACCOUNT',
  RESEND_CONFIRMATION_ACCOUNT: 'RESEND_CONFIRMATION_ACCOUNT',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  SAVE_USER_AVATAR: 'SAVE_USER_AVATAR',
  REMOVE_USER_AVATAR: 'REMOVE_USER_AVATAR',
};

export type QUEUE = (typeof QUEUE)[keyof typeof QUEUE];

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE.WELCOME) public welcome: Queue,
    @InjectQueue(QUEUE.SEND_CONFIRMATION_ACCOUNT) public sendConfirmationAccount: Queue, // prettier-ignore
    @InjectQueue(QUEUE.RESEND_CONFIRMATION_ACCOUNT) public resendConfirmationAccount: Queue, // prettier-ignore
    @InjectQueue(QUEUE.FORGOT_PASSWORD) public forgotPassword: Queue,
    @InjectQueue(QUEUE.SAVE_USER_AVATAR) public saveUserAvatar: Queue,
    @InjectQueue(QUEUE.REMOVE_USER_AVATAR) public removeUserAvatar: Queue,
  ) {}
}
