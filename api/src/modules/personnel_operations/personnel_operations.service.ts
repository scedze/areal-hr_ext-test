import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { pool } from '../../database/pool';
import { CreatePersonnelOperationDto } from './dto/create-personnel_operation.dto';
import { UpdatePersonnelOperationDto } from './dto/update-personnel_operation.dto';

@Injectable()
export class PersonnelOperationsService {
  async create(createDto: CreatePersonnelOperationDto) {
   
    const employeeCheck = await pool.query(
      'SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL',
      [createDto.employee_id]
    );
    if (employeeCheck.rows.length === 0) {
      throw new NotFoundException(`Employee with ID ${createDto.employee_id} not found`);
    }

    if (createDto.department_id) {
      const deptCheck = await pool.query(
        'SELECT id FROM departments WHERE id = $1 AND deleted_at IS NULL',
        [createDto.department_id]
      );
      if (deptCheck.rows.length === 0) {
        throw new NotFoundException(`Department with ID ${createDto.department_id} not found`);
      }
    }

    if (createDto.position_id) {
      const posCheck = await pool.query(
        'SELECT id FROM positions WHERE id = $1 AND deleted_at IS NULL',
        [createDto.position_id]
      );
      if (posCheck.rows.length === 0) {
        throw new NotFoundException(`Position with ID ${createDto.position_id} not found`);
      }
    }

    const query = `
      INSERT INTO personnel_operations (
        employee_id, operation_type, department_id, position_id, salary, operation_date
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      createDto.employee_id,
      createDto.operation_type,
      createDto.department_id || null,
      createDto.position_id || null,
      createDto.salary || null,
      createDto.operation_date || null,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT po.*,
        e.last_name as employee_last_name,
        e.first_name as employee_first_name,
        d.name as department_name,
        p.name as position_name
      FROM personnel_operations po
      LEFT JOIN employees e ON e.id = po.employee_id
      LEFT JOIN departments d ON d.id = po.department_id
      LEFT JOIN positions p ON p.id = po.position_id
      WHERE po.deleted_at IS NULL
      ORDER BY po.operation_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async findByEmployee(employeeId: string) {
    const query = `
      SELECT * FROM personnel_operations
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY operation_date DESC
    `;
    const result = await pool.query(query, [employeeId]);
    return result.rows;
  }

  async findOne(id: string) {
    const query = `
      SELECT po.*,
        e.last_name as employee_last_name,
        e.first_name as employee_first_name,
        d.name as department_name,
        p.name as position_name
      FROM personnel_operations po
      LEFT JOIN employees e ON e.id = po.employee_id
      LEFT JOIN departments d ON d.id = po.department_id
      LEFT JOIN positions p ON p.id = po.position_id
      WHERE po.id = $1 AND po.deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Personnel operation with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: string, updateDto: UpdatePersonnelOperationDto) {
    await this.findOne(id);

    const allowedFields = [
      'employee_id', 'operation_type', 'department_id',
      'position_id', 'salary', 'operation_date'
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
      UPDATE personnel_operations
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: string): Promise<void> {
    const query = `
      UPDATE personnel_operations
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`Personnel operation with ID ${id} not found`);
    }
  }
}