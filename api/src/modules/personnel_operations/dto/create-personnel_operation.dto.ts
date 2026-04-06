import { IsString, IsUUID, IsOptional, IsNumber, IsDateString, IsNotEmpty, Min } from 'class-validator';

export class CreatePersonnelOperationDto {
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsString()
  @IsNotEmpty()
  operation_type: 'hire' | 'salary_change' | 'department_change' | 'dismissal';

  @IsOptional()
  @IsUUID()
  department_id?: string;

  @IsOptional()
  @IsUUID()
  position_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @IsOptional()
  @IsDateString()
  operation_date?: string;
}