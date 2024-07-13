import { Injectable } from '@nestjs/common';
import { MongoService } from '@/infra/database/mongo/mongo-service';
import { CreateLogErrorDto } from '@/infra/logging/log-error/dto/create-log-error.dto';

@Injectable()
export class LogErrorService {
  constructor(private readonly mongoService: MongoService) {}

  async create(createLogErrorDto: CreateLogErrorDto) {
    return await this.mongoService.errorLogModel.create({
      method: createLogErrorDto.method,
      url: createLogErrorDto.url,
      statusCode: createLogErrorDto.statusCode,
      errorMessage: createLogErrorDto.errorMessage,
      userId: createLogErrorDto.userId,
      stack: createLogErrorDto.stack,
      requestHeaders: JSON.stringify(createLogErrorDto.requestHeaders, null, 2),
      requestBody: JSON.stringify(createLogErrorDto.requestBody, null, 2),
      timestamp: new Date().toISOString(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(order: 'asc' | 'desc' = 'desc', limit = 2, offset = 0) {
    const logs = await this.mongoService.errorLogModel.find();

    return logs
      .slice(logs.length - 2, logs.length)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getDate() - new Date(b.timestamp).getDate(),
      );
  }
}
