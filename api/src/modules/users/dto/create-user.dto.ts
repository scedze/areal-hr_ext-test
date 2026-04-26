import { IsString, IsUUID, IsOptional, MaxLength, IsNotEmpty, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  first_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middle_name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'hr_manager'])
  role: string;
}