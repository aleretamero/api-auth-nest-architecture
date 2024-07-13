import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

export class GetErrosLogQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  offset?: number;

  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
