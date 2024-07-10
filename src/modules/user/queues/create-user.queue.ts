import { Injectable } from '@nestjs/common';
import { QUEUE, QueueService } from '@/infra/queue/queue.service';
import { CreateUserJob } from '@/modules/user/jobs/create-user.job';

@Injectable()
export class CreateUserQueue {
  constructor(private readonly queueService: QueueService) {}

  public async add(data: CreateUserJob.Data): Promise<void> {
    await this.queueService.queueCreateUser.add(QUEUE.CREATE_USER, data);
  }
}
