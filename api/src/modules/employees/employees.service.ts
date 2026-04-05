import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../../database/pool';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  async create(createDto: CreateEmployeeDto) {
    const query = `
      INSERT INTO employees (
        last_name, first_name, middle_name, birth_date,
        passport_series, passport_number, passport_issue_date,
        passport_department_code, passport_issued_by,
        registration_region, registration_locality, registration_street,
        registration_house, registration_building, registration_apartment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    const values = [
      createDto.last_name,
      createDto.first_name,
      createDto.middle_name || null,
      createDto.birth_date || null,
      createDto.passport_series || null,
      createDto.passport_number || null,
      createDto.passport_issue_date || null,
      createDto.passport_department_code || null,
      createDto.passport_issued_by || null,
      createDto.registration_region || null,
      createDto.registration_locality || null,
      createDto.registration_street || null,
      createDto.registration_house || null,
      createDto.registration_building || null,
      createDto.registration_apartment || null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT * FROM employees
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async findOne(id: string) {
    const query = `
      SELECT * FROM employees
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: string, updateDto: UpdateEmployeeDto) {
    await this.findOne(id);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateDto)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
      UPDATE employees
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: string): Promise<void> {
    const query = `
      UPDATE employees
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
}