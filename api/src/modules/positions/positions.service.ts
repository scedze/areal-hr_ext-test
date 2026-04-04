import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../../database/pool';
@Injectable()
export class PositionsService {
  async create(data: { name: string }) {
    const query = `
            INSERT INTO positions(name)
            VALUES ($1)
            RETURNING id, name, created_at, updated_at
        `;
    const result = await pool.query(query, [data.name]);
    return result.rows[0];
  }
  async findAll() {
    const query = `
            SELECT id, name, created_at, updated_at
            FROM positions
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
        `;
    const result = await pool.query(query);
    return result.rows;
  }
  async findOne(id: string) {
    const query = `
            SELECT id, name, created_at, updated_at
            FROM positions
            WHERE id =$1 AND deleted_at IS NULL
        `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Positions with ID ${id} not found`);
    }
    return result.rows[0];
  }
  async update(id: string, data: { name?: string }) {
    if (data.name === undefined) {
      return this.findOne(id);
    }
    const query = `
            UPDATE positions
            SET name = $1
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING id, name, created_at, updated_at
        `;
    const result = await pool.query(query, [data.name, id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return result.rows[0];
  }
  async remove(id: string) {
    const query = `
        UPDATE positions
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
  }
}
