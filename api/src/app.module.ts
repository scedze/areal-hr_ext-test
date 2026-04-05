import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { EmployeesModule } from './modules/employees/employees.module';

@Module({
  imports: [OrganizationsModule, DepartmentsModule, PositionsModule, EmployeesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
