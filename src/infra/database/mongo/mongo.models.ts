import {
  LogErrorModel,
  ErrorLogSchema,
} from '@/infra/logging/log-error/models/log-error-model';

export default [
  {
    name: LogErrorModel.name,
    schema: ErrorLogSchema,
  },
];
