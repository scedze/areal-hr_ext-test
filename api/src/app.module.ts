import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DepartmentsModule } from './modules/departments/departments.module';

@Module({
  imports: [OrganizationsModule, DepartmentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
