import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OperationHistoryService } from './operation_history.service';
import { CreateOperationHistoryDto } from './dto/create-operation_history.dto';

@Controller('operation-history')
export class OperationHistoryController {
  constructor(private readonly operationHistoryService: OperationHistoryService) {}

  @Post()
  async create(@Body() createDto: CreateOperationHistoryDto) {
    return this.operationHistoryService.log(createDto);
  }

  @Get()
  async findAll() {
    return this.operationHistoryService.findAll();
  }

  @Get('entity')
  async findByEntity(@Query('type') entityType: string, @Query('id') entityId: string) {
    return this.operationHistoryService.findByEntity(entityType, entityId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.operationHistoryService.findByUser(userId);
  }
}