import {Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus} from '@nestjs/common';
import {DepartmentsService} from './departments.service';
@Controller('departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) {}
    @Post()
    async create(@Body() body: {
        name: string;
        organization_id: string;
        parent_id?: string;
        comment?: string;
    }) {
        return this.departmentsService.create(body);
    }
    @Get()
    async findAll(
        @Query('tree') tree?: string,
        @Query('organizationId') organizationId?: string,
    ) {
        if (tree === 'tree') {
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
        @Param('id') id: string,
        @Body() body: {name?: string; parent_id?: string; comment?: string},
    ) {
        return this.departmentsService.update(id, body);
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.departmentsService.remove(id);
    }
    @Post(':id/restore')
    async restore(@Param('id') id: string) {
        return this.departmentsService.restore(id);
    }
}