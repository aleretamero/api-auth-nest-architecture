import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export namespace ErrorLogModel {
  export interface CreateErrorLog {
    method: string;
    url: string;
    statusCode: number;
    errorMessage?: string;
    userId?: string;
    stack?: string;
    requestHeaders?: string;
    requestBody?: string;
  }
}

@Schema({ collection: 'error_logs' })
export class ErrorLogModel {
  @Prop({ required: true })
  timestamp!: string;

  @Prop({ required: true })
  method!: string;

  @Prop({ required: true })
  url!: string;

  @Prop({ required: false })
  statusCode!: number;

  @Prop({ required: false })
  errorMessage?: string;

  @Prop({ required: false })
  userId?: string;

  @Prop({ required: false })
  stack?: string;

  @Prop({ required: false })
  requestHeaders?: string;

  @Prop({ required: false })
  requestBody?: string;

  constructor(partialModel: Partial<ErrorLogModel>) {
    Object.assign(this, partialModel);
  }

  static create = (props: ErrorLogModel.CreateErrorLog): ErrorLogModel => {
    return new ErrorLogModel({
      timestamp: new Date().toISOString(),
      method: props.method,
      url: props.url,
      statusCode: props.statusCode,
      errorMessage: props.errorMessage,
      userId: props.userId,
      stack: props.stack,
      requestHeaders: props.requestHeaders,
      requestBody: props.requestBody,
    });
  };
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLogModel);
