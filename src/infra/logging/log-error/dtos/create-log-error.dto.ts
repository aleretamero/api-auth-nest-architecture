export class CreateLogErrorDto {
  method!: string;
  url!: string;
  statusCode!: number;
  errorMessage?: string;
  userId?: string;
  stack?: string;
  requestHeaders?: any;
  requestBody?: any;
}
