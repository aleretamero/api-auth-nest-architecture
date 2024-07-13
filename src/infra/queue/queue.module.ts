import environment from '@/configs/environment';

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE, QueueService } from '@/infra/queue/queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: environment.QUEUE_REDIS_HOST,
        port: environment.QUEUE_REDIS_PORT,
      },
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUE).map((queue) => ({ name: queue })),
    ),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
