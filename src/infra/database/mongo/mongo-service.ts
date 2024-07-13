import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogErrorModel } from '@/infra/logging/log-error/models/log-error-model';

export class MongoService {
  constructor(
    @InjectModel(LogErrorModel.name) public errorLogModel: Model<LogErrorModel>,
  ) {}
}
