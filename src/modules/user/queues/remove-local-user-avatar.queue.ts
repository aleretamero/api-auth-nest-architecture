import { Injectable } from '@nestjs/common';
import { JOB, QueueService } from '@/infra/queue/queue.service';
import { RemoveLocalUserAvatarJob } from '@/modules/user/jobs/remove-local-user-avatar.job';

@Injectable()
export class RemoveLocalUserAvatarQueue {
  constructor(private readonly queueService: QueueService) {}

  public async add(data: RemoveLocalUserAvatarJob.Data): Promise<void> {
    await this.queueService.removeLocalUserAvatar.add(
      JOB.REMOVE_LOCAL_USER_AVATAR,
      data,
    );
  }
}
