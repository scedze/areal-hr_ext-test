import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PersonnelOperationsService } from './personnel-operations.service';
import { CreatePersonnelOperationDto } from './dto/create-personnel-operation.dto';
import { UpdatePersonnelOperationDto } from './dto/update-personnel-operation.dto';

@Controller('personnel-operations')
export class PersonnelOperationsController {
  constructor(private readonly personnelOperationsService: PersonnelOperationsService) {}

  @Post()
  async create(@Body() createDto: CreatePersonnelOperationDto) {
    return this.personnelOperationsService.create(createDto);
  }

  @Get()
  async findAll(@Query('employeeId') employeeId?: string) {
    if (employeeId) {
      return this.personnelOperationsService.findByEmployee(employeeId);
    }
    return this.personnelOperationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.personnelOperationsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdatePersonnelOperationDto) {
    return this.personnelOperationsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.personnelOperationsService.remove(id);
  }
}