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
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { StorageService } from '@/infra/storage/storage.service';

export namespace SaveUserAvatarJob {
  export type Data = {
    userId: string;
  };
}

@Processor(QUEUE.SAVE_USER_AVATAR)
export class SaveUserAvatarJob {
  private readonly logger = new Logger(SaveUserAvatarJob.name);

  constructor(
    private readonly typeormService: TypeormService,
    private readonly storageService: StorageService,
  ) {}

  @Process(JOB.SAVE_USER_AVATAR)
  public async process({
    moveToCompleted,
    data,
  }: Job<SaveUserAvatarJob.Data>): Promise<void> {
    let user = await this.typeormService.user.findOne({
      where: { id: data.userId },
    });

    if (!user || !user.avatarPath) {
      moveToCompleted();
      return;
    }

    const { path, publicUrl } = await this.storageService.uploadFileFromPath(
      user,
      user.avatarPath,
    );

    user = this.typeormService.user.merge(user, {
      avatarUrl: publicUrl,
      avatarPath: path,
    });

    // await this.typeormService.user.save(user);
  }

  @OnQueueActive()
  public onActive(job: Job<SaveUserAvatarJob.Data>): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<SaveUserAvatarJob.Data>): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onFailed(job: Job<SaveUserAvatarJob.Data>, error: Error): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
