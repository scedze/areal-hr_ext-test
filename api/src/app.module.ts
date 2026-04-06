import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { FilesModule } from './modules/files/files.module';
import { PersonnelOperationsModule } from './modules/personnel_operations/personnel_operations.module';
import { OperationHistoryModule } from './modules/operation_history/operation_history.module';

@Module({
  imports: [OrganizationsModule, DepartmentsModule, PositionsModule, EmployeesModule, FilesModule, PersonnelOperationsModule, OperationHistoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
