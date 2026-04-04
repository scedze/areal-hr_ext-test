import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdateDepartmentDto } from '../departments/dto/update-department.dto';
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}
  @Post()
  async create(@Body() createDto: CreatePositionDto) {
    return this.positionsService.create(createDto);
  }
  @Get()
  async findAll() {
    return this.positionsService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateDepartmentDto) {
    return this.positionsService.update(id, updateDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.positionsService.remove(id);
  }
}
