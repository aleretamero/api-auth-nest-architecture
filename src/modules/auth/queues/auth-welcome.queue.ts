import { Injectable } from '@nestjs/common';
import { JOB, QueueService } from '@/infra/queue/queue.service';
import { WelcomeJob } from '@/modules/auth/jobs/auth-welcome.job';

@Injectable()
export class AuthWelcomeQueue {
  constructor(private readonly queueService: QueueService) {}

  public async add(data: WelcomeJob.Data): Promise<void> {
    await this.queueService.welcome.add(JOB.WELCOME, data);
  }
}