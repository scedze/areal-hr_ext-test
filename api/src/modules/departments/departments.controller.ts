import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}
  @Post()
  async create(
    @Body() createDto: CreateDepartmentDto ) {
    return this.departmentsService.create(createDto);
  }
  @Get()
  async findAll(@Query('tree') tree?: string, @Query('organizationId') organizationId?: string) {
    if (tree === 'true') {
      return this.departmentsService.findTree();
    }
    if (organizationId) {
      return this.departmentsService.findByOrganization(organizationId);
    }
    return this.departmentsService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }
  @Put(':id')
  async update(
    @Param('id') id: string, @Body() updateDto: UpdateDepartmentDto) {
    return this.departmentsService.update(id, updateDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.departmentsService.remove(id);
  }
  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return this.departmentsService.restore(id);
  }
}
