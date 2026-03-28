import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}
    @Post()
    async create(@Body() body: {name: string; comment?: string}) {
        return this.organizationsService.create(body);
    }
    @Get()
    async findAll() {
        return this.organizationsService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.organizationsService.findOne(id);
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: {name?: string; comment?: string}) {
        return this.organizationsService.update(id, body);
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.organizationsService.remove(id);
    }
}