import { Injectable } from '@nestjs/common';
import { MongoService } from '@/infra/database/mongo/mongo-service';
import { CreateLogErrorDto } from '@/infra/logging/log-error/dtos/create-log-error.dto';
import { GetErrosLogQuery } from '@/infra/logging/log-error/queries/get-errors-log.query';

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
      requestBody: JSON.stringify(
        this.removePasswordFromRequestBody(createLogErrorDto.requestBody),
        null,
        2,
      ),
      timestamp: new Date().toISOString(),
    });
  }

  async findAll({ limit = 5, offset = 0, order = 'desc' }: GetErrosLogQuery) {
    return await this.mongoService.errorLogModel
      .find()
      .sort({ timestamp: order })
      .limit(limit)
      .skip(offset);
  }

  private removePasswordFromRequestBody<T extends Record<string, any>>(
    data?: T,
  ) {
    if (!data) {
      return data;
    }

    for (const key in data) {
      if (
        key.toLowerCase().includes('password') &&
        typeof data[key] === 'string'
      ) {
        (data[key] as string) = '*'.repeat(8);
        continue;
      }

      if (typeof data[key] === 'object') {
        (data[key] as any) = this.removePasswordFromRequestBody(data[key]);
        continue;
      }

      data[key] = data[key];
    }

    return data;
  }
}
