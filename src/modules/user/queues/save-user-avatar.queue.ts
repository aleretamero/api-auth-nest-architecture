import { Injectable } from '@nestjs/common';
import { JOB, QueueService } from '@/infra/queue/queue.service';
import { SaveUserAvatarJob } from '@/modules/user/jobs/save-user-avatar.job';

@Injectable()
export class SaveUserAvatarQueue {
  constructor(private readonly queueService: QueueService) {}

  public async add(data: SaveUserAvatarJob.Data): Promise<void> {
    await this.queueService.createUser.add(JOB.SAVE_USER_AVATAR, data);
  }
}
