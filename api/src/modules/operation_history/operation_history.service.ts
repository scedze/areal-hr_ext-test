import { Injectable } from '@nestjs/common';
import { pool } from '../../database/pool';
import { CreateOperationHistoryDto } from './dto/create-operation_history.dto';

@Injectable()
export class OperationHistoryService {
  async log(createDto: CreateOperationHistoryDto) {
    const query = `
      INSERT INTO operation_history (user_id, entity_type, entity_id, changed_fields)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      createDto.user_id,
      createDto.entity_type,
      createDto.entity_id,
      createDto.changed_fields ? JSON.stringify(createDto.changed_fields) : null,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT * FROM operation_history
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async findByEntity(entityType: string, entityId: string) {
    const query = `
      SELECT * FROM operation_history
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [entityType, entityId]);
    return result.rows;
  }

  async findByUser(userId: string) {
    const query = `
      SELECT * FROM operation_history
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}