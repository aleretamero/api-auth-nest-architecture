import { ApiProperty } from '@nestjs/swagger';

export class ApiError {
  @ApiProperty()
  message!: string;

  @ApiProperty()
  errors!: string[];

  @ApiProperty()
  statusCode!: number;
}
