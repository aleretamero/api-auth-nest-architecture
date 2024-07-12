import { JOB, QUEUE } from '@/infra/queue/queue.service';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { MailService } from '@/infra/mail/mail.service';

export namespace ForgotPasswordJob {
  export type Data = {
    email: string;
    code: string;
  };
}

@Processor(QUEUE.FORGOT_PASSWORD)
export class AuthForgotPasswordJob {
  private readonly logger = new Logger(AuthForgotPasswordJob.name);

  constructor(private readonly mailService: MailService) {}

  @Process(JOB.FORGOT_PASSWORD)
  public async process({ data }: Job<ForgotPasswordJob.Data>): Promise<void> {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Forgot Password',
      text: 'Your verification code is: ' + data.code,
    });
  }

  @OnQueueActive()
  public onActive(job: Job<ForgotPasswordJob.Data>): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<ForgotPasswordJob.Data>): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onFailed(job: Job<ForgotPasswordJob.Data>, error: Error): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
