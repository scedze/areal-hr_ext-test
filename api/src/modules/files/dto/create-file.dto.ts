import { IsString, IsUUID, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  file_path: string;

  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsOptional()
  @IsString()
  mime_type?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  size_bytes?: number;

}