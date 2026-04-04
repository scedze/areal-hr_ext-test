import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty({ message: 'name should not be empty'})
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  comment?: string;
}