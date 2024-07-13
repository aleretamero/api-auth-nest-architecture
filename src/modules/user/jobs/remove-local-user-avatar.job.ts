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
import { LocalStorageService } from '@/infra/storage/local-storage/local-storage.service';

export namespace RemoveLocalUserAvatarJob {
  export type Data = {
    pathName: string;
  };
}

@Processor(QUEUE.REMOVE_LOCAL_USER_AVATAR)
export class RemoveLocalUserAvatarJob {
  private readonly logger = new Logger(RemoveLocalUserAvatarJob.name);

  constructor(private readonly localStorageService: LocalStorageService) {}

  @Process(JOB.REMOVE_LOCAL_USER_AVATAR)
  public async process({
    data,
  }: Job<RemoveLocalUserAvatarJob.Data>): Promise<void> {
    this.localStorageService.removeFile(data.pathName);
  }

  @OnQueueActive()
  public onActive(job: Job<RemoveLocalUserAvatarJob.Data>): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<RemoveLocalUserAvatarJob.Data>): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onFailed(job: Job<RemoveLocalUserAvatarJob.Data>, error: Error): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
