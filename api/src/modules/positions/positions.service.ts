import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../../database/pool';
@Injectable()
export class PositionsService {
  async create(data: { name: string; organization_id?: string }) {
    const query = `
            INSERT INTO positions(name)
            VALUES ($1)
            RETURNING id, name, created_at, updated_at
        `;
    const result = await pool.query(query, [data.name]);
    return result.rows[0];
  }
  async findAll(organizationId?: string) {
    let query = `
      SELECT p.id, p.name, p.organization_id, p.created_at, p.updated_at,
             o.name as organization_name
      FROM positions p
      LEFT JOIN organizations o ON o.id = p.organization_id
      WHERE p.deleted_at IS NULL
    `;
    const values: any[] = [];
    if (organizationId) {
      query += ` AND p.organization_id = $1`;
      values.push(organizationId);
    }
    query += ` ORDER BY p.created_at DESC`;
    const result = await pool.query(query, values);
    return result.rows;
  }
  async findOne(id: string) {
    const query = `
      SELECT p.id, p.name, p.organization_id, p.created_at, p.updated_at,
              o.name as organization_name
      FROM positions p
      LEFT JOIN organizations o ON o.id = p.organization_id
      WHERE p.id = $1 AND p.deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Positions with ID ${id} not found`);
    }
    return result.rows[0];
  }
  async update(id: string, data: { name?: string; organization_id?: string | null }) {
    if (data.name === undefined) {
      return this.findOne(id);
    }
    const query = `
            UPDATE positions
            SET name = $1, updated_at = NOW()
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
