import { IsString, IsUUID, IsOptional, IsObject } from 'class-validator';

export class CreateOperationHistoryDto {
  @IsUUID()
  user_id: string;

  @IsString()
  entity_type: string;

  @IsUUID()
  entity_id: string;

  @IsOptional()
  @IsObject()
  changed_fields?: Record<string, any>;
}