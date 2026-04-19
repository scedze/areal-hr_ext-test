import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../../database/pool';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  async create(createDto: CreateFileDto) {

    const employeeCheck = await pool.query(
      'SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL',
      [createDto.employee_id]
    );
    if (employeeCheck.rows.length === 0) {
      throw new NotFoundException(`Employee with ID ${createDto.employee_id} not found`);
    }

    const query = `
      INSERT INTO files (name, file_path, employee_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [
      createDto.name,
      createDto.file_path,
      createDto.employee_id,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT * FROM files
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async findByEmployee(employeeId: string) {
    const query = `
      SELECT * FROM files
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [employeeId]);
    return result.rows;
  }

  async findOne(id: string) {
    const query = `
      SELECT * FROM files
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: string, updateDto: UpdateFileDto) {
    await this.findOne(id);

    const allowedFields = [
      'name', 'file_path', 'employee_id'
    ];

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateDto)) {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
      UPDATE files
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: string): Promise<void> {
    const query = `
      UPDATE files
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
  }
}