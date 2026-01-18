import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString, Max } from 'class-validator';

export class CreateTimeEntryDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsNumber()
  @IsPositive()
  @Max(24)
  hours: number;

  @IsString()
  description: string;
}