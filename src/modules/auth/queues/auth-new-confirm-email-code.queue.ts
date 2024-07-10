import { Injectable } from '@nestjs/common';
import { QUEUE, QueueService } from '@/infra/queue/queue.service';
import { AuthNewEmailConfirmationCodeJob } from '@/modules/auth/jobs/auth-new-confirm-email-code.job';

@Injectable()
export class AuthNewConfirmEmailCodeQueue {
  constructor(private readonly queueService: QueueService) {}

  public async add(data: AuthNewEmailConfirmationCodeJob.Data): Promise<void> {
    await this.queueService.newEmailConfirmationCode.add(
      QUEUE.NEW_CONFIRM_EMAIL_CODE,
      data,
    );
  }
}
