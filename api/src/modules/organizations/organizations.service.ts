import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../../database/pool';
@Injectable()
export class OrganizationsService {
  async create(data: { name: string; comment?: string | null }) {
    const query = `
            INSERT INTO organizations(name, comment)
            VALUES ($1, $2)
            RETURNING id, name, comment, created_at, updated_at
        `;
    const result = await pool.query(query, [data.name, data.comment || null]);
    return result.rows[0];
  }
  async findAll() {
    const query = `
            SELECT id, name, comment, created_at, updated_at
            FROM organizations
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
        `;
    const result = await pool.query(query);
    return result.rows;
  }
  async findOne(id: string) {
    const query = `
            SELECT id, name, comment, created_at, updated_at
            FROM organizations
            WHERE id =$1 AND deleted_at IS NULL
        `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return result.rows[0];
  }
  async update(id: string, data: { name?: string; comment?: string | null }) {
    
    const allowedFields = [
      'name', 'comment'
    ];
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }
    
    if (updates.length === 0) {
      return this.findOne(id);
    }
    values.push(id);
    const query = `
            UPDATE organizations
            SET ${updates.join(', ')}, updated_at = NOW()
            WHERE id = $${paramIndex} AND deleted_at IS NULL
            RETURNING id, name, comment, created_at, updated_at
        `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return result.rows[0];
  }
  async remove(id: string): Promise<void> {
    const query = `
        UPDATE organizations
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
  }
}
