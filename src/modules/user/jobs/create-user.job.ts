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
import { UserCodeService } from '../sub-modules/user-code/user-code.service';
import { UserCodeType } from '../sub-modules/user-code/enums/user-code-type.enum';

export namespace CreateUserJob {
  export type Data = {
    userId: string;
    email: string;
    password: string;
  };
}

@Processor(QUEUE.CREATE_USER)
export class CreateUserJob {
  private readonly logger = new Logger(CreateUserJob.name);

  constructor(
    private readonly mailService: MailService,
    private readonly userCodeService: UserCodeService,
  ) {}

  @Process(JOB.CREATE_USER)
  public async process({ data }: Job<CreateUserJob.Data>): Promise<void> {
    const code = await this.userCodeService.create(
      data.userId,
      UserCodeType.EMAIL_VERIFICATION,
    );

    await this.mailService.sendMail({
      to: data.email,
      subject: 'Create User',
      text:
        'Your verification code is: ' +
        code +
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
