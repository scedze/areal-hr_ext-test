import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

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

}