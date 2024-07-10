import { QUEUE } from '@/infra/queue/queue.service';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '@/infra/mail/mail.service';
import { Logger } from '@nestjs/common';

export namespace AuthNewEmailConfirmationCodeJob {
  export type Data = {
    email: string;
    code: string;
  };
}

@Processor(QUEUE.NEW_CONFIRM_EMAIL_CODE)
export class AuthNewConfirmEmailCodeJob {
  private readonly logger = new Logger(AuthNewConfirmEmailCodeJob.name);

  constructor(private readonly mailService: MailService) {}

  @Process(QUEUE.NEW_CONFIRM_EMAIL_CODE)
  public async process({
    data,
  }: Job<AuthNewEmailConfirmationCodeJob.Data>): Promise<void> {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Email Verification',
      text: 'Your verification code is: ' + data.code,
    });
  }

  @OnQueueActive()
  public onActive(job: Job<AuthNewEmailConfirmationCodeJob.Data>): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<AuthNewEmailConfirmationCodeJob.Data>): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onFailed(
    job: Job<AuthNewEmailConfirmationCodeJob.Data>,
    error: Error,
  ): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
