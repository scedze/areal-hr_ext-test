import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../../database/pool';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  async create(createDto: CreateEmployeeDto) {
    const query = `
      INSERT INTO employees (
        last_name, first_name, middle_name, birth_date, phone,
        passport_series, passport_number, passport_issue_date,
        passport_department_code, passport_issued_by,
        registration_region, registration_locality, registration_street,
        registration_house, registration_building, registration_apartment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    const values = [
      createDto.last_name,
      createDto.first_name,
      createDto.middle_name || null,
      createDto.birth_date || null,
      createDto.phone || null,
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

  async findAll(filters: { departmentId?: string; positionId?: string; search?: string; includeDismissed?: boolean }) {
    let query = `
      SELECT e.*,
        d.name as department_name,
        p.name as position_name,
        o.name as organization_name,
        CASE WHEN e.deleted_at IS NOT NULL THEN true ELSE false END as is_dismissed
      FROM employees e
      LEFT JOIN departments d ON d.id = e.department_id
      LEFT JOIN positions p ON p.id = e.position_id
      LEFT JOIN organizations o ON o.id = e.organization_id
      WHERE 1=1
    `;
    const values: any[] = [];
    let paramIndex = 1;
    if (!filters.includeDismissed) {
      query += ` AND e.deleted_at IS NULL`;
    }
    if (filters.departmentId) {
      query += ` AND e.department_id = $${paramIndex++}`;
      values.push(filters.departmentId);
    }
    if (filters.positionId) {
      query += ` AND e.position_id = $${paramIndex++}`;
      values.push(filters.positionId);
    }
    if (filters.search) {
      query += ` AND (e.last_name ILIKE $${paramIndex} OR e.first_name ILIKE $${paramIndex} OR e.middle_name ILIKE $${paramIndex})`;
      values.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
      paramIndex += 2;
    }
    query += ` ORDER BY e.created_at DESC`;
    const result = await pool.query(query, values);
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

    const allowedFields = [
      'last_name', 'first_name', 'middle_name', 'birth_date', 'phone',
      'passport_series', 'passport_number', 'passport_issue_date',
      'passport_department_code', 'passport_issued_by',
      'registration_region', 'registration_locality', 'registration_street',
      'registration_house', 'registration_building', 'registration_apartment'
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
      UPDATE employees
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: string): Promise<void> {
    const operationsCheck = await pool.query(
      'SELECT id FROM personal_operations WHERE employee_id = $1', [id]
    );
    if (operationsCheck.rows.length > 0) {
      throw new BadRequestException('Cannot delete employee with existing operations');
    }
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

  async restore(id: string) {
    const query = `
    UPDATE employees
    SET deleted_at = NULL
    WHERE id = $1
    RETURNING *
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw  new NotFoundException(`Employee with ID ${id} not found`);
    }
    return result.rows[0];
  }
}