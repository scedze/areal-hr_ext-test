import { IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsUUID()
  organization_id?: string;
}