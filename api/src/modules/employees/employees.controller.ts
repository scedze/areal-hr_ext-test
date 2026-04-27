import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(@Body() createDto: CreateEmployeeDto) {
    return this.employeesService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('departmentid') departmentId?: string,
    @Query('positionId') positionId?: string,
    @Query('search') search?: string,
    @Query('includeDismissed') includeDismissed?: string,
  ) {
    return this.employeesService.findAll({departmentId, positionId, search, includeDismissed: includeDismissed === 'true',});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.employeesService.remove(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    return this.employeesService.restore(id);
  }
}