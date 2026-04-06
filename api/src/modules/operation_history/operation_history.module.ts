import { Module } from '@nestjs/common';
import { OperationHistoryController } from './operation_history.controller';
import { OperationHistoryService } from './operation_history.service';

@Module({
  controllers: [OperationHistoryController],
  providers: [OperationHistoryService],
  exports: [OperationHistoryService],
})
export class OperationHistoryModule {}