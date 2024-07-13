/* eslint-disable @typescript-eslint/no-unused-vars */
import { QUEUE } from '@/infra/queue/queue.service';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { SupabaseService } from '@/infra/storage/supabase/supabase.service';

export namespace RemoveUserAvatarJob {
  export type Data = {
    avatarPath: string;
  };
}

@Processor(QUEUE.REMOVE_USER_AVATAR)
export class RemoveUserAvatarJob {
  private readonly logger = new Logger(RemoveUserAvatarJob.name);

  constructor(
    // private readonly typeormService: TypeormService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Process(QUEUE.REMOVE_USER_AVATAR)
  public async process({
    moveToCompleted,
    data,
  }: Job<RemoveUserAvatarJob.Data>): Promise<void> {
    // let user = await this.typeormService.user.findOne({
    //   where: { id: data.avatarPath },
    // });
    // if (!user || !user.avatarPath) {
    //   moveToCompleted();
    //   return;
    // }
    // await this.supabaseService.deleteFile(user, user.avatarPath);
    // user = this.typeormService.user.merge(user, {
    //   avatarUrl: null,
    //   avatarPath: null,
    // });
    // await this.typeormService.user.save(user);
  }

  @OnQueueActive()
  public onActive(job: Job<RemoveUserAvatarJob.Data>): void {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job<RemoveUserAvatarJob.Data>): void {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onFailed(job: Job<RemoveUserAvatarJob.Data>, error: Error): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
