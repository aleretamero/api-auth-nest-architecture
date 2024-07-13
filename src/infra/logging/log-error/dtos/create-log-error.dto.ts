export class CreateLogErrorDto {
  method!: string;
  url!: string;
  statusCode!: number;
  errorMessage?: string;
  userId?: string;
  stack?: string;
  requestHeaders?: string;
  requestBody?: string;
}
