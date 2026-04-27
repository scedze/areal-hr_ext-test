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
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('organizations')
@UseGuards(AuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Post()
  @Roles('admin')
  async create(@Body() createDto: CreateOrganizationDto) {
    return this.organizationsService.create(createDto);
  }
  @Get()
  @Roles('admin', 'hr_manager')
  async findAll() {
    return this.organizationsService.findAll();
  }
  @Get(':id')
  @Roles('admin', 'hr_manager')
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }
  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateDto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, updateDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.organizationsService.remove(id);
  }
}
