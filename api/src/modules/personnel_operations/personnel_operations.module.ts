import { Module } from '@nestjs/common';
import { PersonnelOperationsController } from './personnel_operations.controller';
import { PersonnelOperationsService } from './personnel_operations.service';

@Module({
  controllers: [PersonnelOperationsController],
  providers: [PersonnelOperationsService],
  exports: [PersonnelOperationsService],
})
export class PersonnelOperationsModule {}