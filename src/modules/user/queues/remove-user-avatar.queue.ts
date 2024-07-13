import { Injectable } from '@nestjs/common';
import { JOB, QueueService } from '@/infra/queue/queue.service';
import { RemoveUserAvatarJob } from '@/modules/user/jobs/remove-user-avatar.job';

@Injectable()
export class RemoveUserAvatarQueue {
  constructor(private readonly queueService: QueueService) {}

  public async add(data: RemoveUserAvatarJob.Data): Promise<void> {
    await this.queueService.removeUserAvatar.add(JOB.REMOVE_USER_AVATAR, data);
  }
}
