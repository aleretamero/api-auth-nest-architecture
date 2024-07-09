import {
  ErrorLogModel,
  ErrorLogSchema,
} from '@/infra/database/mongo/models/error-log-model';

export default [
  {
    name: ErrorLogModel.name,
    schema: ErrorLogSchema,
  },
];
