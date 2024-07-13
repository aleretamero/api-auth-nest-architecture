import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from '@/infra/database/mongo/mongo-service';
import environment from '@/configs/environment';
import models from '@/infra/database/mongo/mongo.models';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGO_URI, {
      dbName: environment.MONGO_DB,
      auth: {
        username: environment.MONGO_USER,
        password: environment.MONGO_PASS,
      },
    }),
    MongooseModule.forFeature(models),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
