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

export namespace WelcomeJob {
  export type Data = {
    email: string;
    code: string;
  };
}

@Processor(QUEUE.WELCOME)
export class WelcomeJob {
  private readonly logger = new Logger(WelcomeJob.name);

  constructor(private readonly mailService: MailService) {}

  @Process(QUEUE.WELCOME)
  public async process({ data }: Job<WelcomeJob.Data>): Promise<void> {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Email Verification',
      text: 'Your verification code is: ' + data.code,
    });
  }

  @OnQueueActive()
  public onActive(job: Job<WelcomeJob.Data>): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<WelcomeJob.Data>): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onFailed(job: Job<WelcomeJob.Data>, error: Error): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
