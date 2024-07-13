import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

export const QUEUE = {
  WELCOME: 'WELCOME',
  NEW_CONFIRM_EMAIL_CODE: 'NEW_CONFIRM_EMAIL_CODE',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CREATE_USER: 'CREATE_USER',
  SAVE_USER_AVATAR: 'SAVE_USER_AVATAR',
  REMOVE_USER_AVATAR: 'REMOVE_USER_AVATAR',
  REMOVE_LOCAL_USER_AVATAR: 'REMOVE_LOCAL_USER_AVATAR',
};

export type QUEUE = (typeof QUEUE)[keyof typeof QUEUE];

export const JOB = {
  WELCOME: 'WELCOME',
  NEW_CONFIRM_EMAIL_CODE: 'NEW_CONFIRM_EMAIL_CODE',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CREATE_USER: 'CREATE_USER',
  SAVE_USER_AVATAR: 'SAVE_USER_AVATAR',
  REMOVE_USER_AVATAR: 'REMOVE_USER_AVATAR',
  REMOVE_LOCAL_USER_AVATAR: 'REMOVE_LOCAL_USER_AVATAR',
};

export type JOB = (typeof JOB)[keyof typeof JOB];

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE.WELCOME) public welcome: Queue,
    @InjectQueue(QUEUE.NEW_CONFIRM_EMAIL_CODE) public newEmailConfirmationCode: Queue, // prettier-ignore
    @InjectQueue(QUEUE.FORGOT_PASSWORD) public forgotPassword: Queue,
    @InjectQueue(QUEUE.CREATE_USER) public createUser: Queue,
    @InjectQueue(QUEUE.SAVE_USER_AVATAR) public saveUserAvatar: Queue,
    @InjectQueue(QUEUE.REMOVE_USER_AVATAR) public removeUserAvatar: Queue,
    @InjectQueue(QUEUE.REMOVE_LOCAL_USER_AVATAR) public removeLocalUserAvatar: Queue, // prettier-ignore
  ) {}
}
