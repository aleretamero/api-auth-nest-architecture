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
import { User } from '../entities/user.entity';
import { DataSource } from 'typeorm';

export namespace SaveUserAvatarJob {
  export type Data = {
    user: User;
  };
}

@Processor(QUEUE.SAVE_USER_AVATAR)
export class SaveUserAvatarJob {
  private readonly logger = new Logger(SaveUserAvatarJob.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly dataSource: DataSource,
  ) {}

  @Process(QUEUE.SAVE_USER_AVATAR)
  public async process({ data }: Job<SaveUserAvatarJob.Data>): Promise<void> {
    if (!data.user?.avatarPath) {
      return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { path, publicUrl } =
        await this.supabaseService.uploadFileFromLocalStorage(
          'USER',
          data.user.avatarPath,
        );

      const userRepository = queryRunner.manager.getRepository(User);

      data.user = userRepository.merge(data.user, {
        avatarUrl: publicUrl,
        avatarPath: path,
      });

      await userRepository.save(data.user);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
