import { QUEUE } from '@/infra/queue/queue.service';
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

export namespace CreateUserJob {
  export type Data = {
    email: string;
    password: string;
    code: string;
  };
}

@Processor(QUEUE.CREATE_USER)
export class CreateUserJob {
  private readonly logger = new Logger(CreateUserJob.name);

  constructor(private readonly mailService: MailService) {}

  @Process(QUEUE.CREATE_USER)
  public async process({ data }: Job<CreateUserJob.Data>): Promise<void> {
    await this.mailService.sendMail({
      to: data.email,
      subject: 'Create User',
      text:
        'Your verification code is: ' +
        data.code +
        ' and your password is: ' +
        data.password,
    });
  }

  @OnQueueActive()
  public onActive(job: Job<CreateUserJob.Data>): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<CreateUserJob.Data>): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onFailed(job: Job<CreateUserJob.Data>, error: Error): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
