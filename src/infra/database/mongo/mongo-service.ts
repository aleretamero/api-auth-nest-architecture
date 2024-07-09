import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorLogModel } from '@/infra/database/mongo/models/error-log-model';

export class MongoService {
  constructor(
    @InjectModel(ErrorLogModel.name) public errorLogModel: Model<ErrorLogModel>,
  ) {}
}
