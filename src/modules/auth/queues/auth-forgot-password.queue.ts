import { Injectable } from '@nestjs/common';
import { QUEUE, QueueService } from '@/infra/queue/queue.service';
import { ForgotPasswordJob } from '@/modules/auth/jobs/auth-forgot-password.job';

@Injectable()
export class AuthForgotPasswordQueue {
  constructor(private readonly queueService: QueueService) {}

  public async add(data: ForgotPasswordJob.Data): Promise<void> {
    await this.queueService.forgotPassword.add(QUEUE.FORGOT_PASSWORD, data);
  }
}
