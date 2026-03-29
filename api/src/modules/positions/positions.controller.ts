import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus} from '@nestjs/common';
import { PositionsService } from './positions.service';
@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}
    @Post()
    async create(@Body() body: {name: string}) {
        return this.positionsService.create(body);
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
    async update(@Param('id') id: string, @Body() body: {name?: string}) {
        return this.positionsService.update(id, body);
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.positionsService.remove(id);
    }
}