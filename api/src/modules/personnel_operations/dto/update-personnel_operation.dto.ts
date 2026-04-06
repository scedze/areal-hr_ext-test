import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonnelOperationDto } from './create-personnel_operation.dto';

export class UpdatePersonnelOperationDto extends PartialType(CreatePersonnelOperationDto) {}