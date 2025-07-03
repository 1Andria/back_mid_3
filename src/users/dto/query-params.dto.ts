import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Math.min(Number(value), 30))
  @IsNumber()
  take: number = 30;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  ageFrom?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  ageTo?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  gender: string;
}
