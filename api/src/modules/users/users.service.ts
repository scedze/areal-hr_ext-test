import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { pool } from '../../database/pool';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  async create(createDto: CreateUserDto) {
    // Проверка уникальности логина
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE login = $1',
      [createDto.login]
    );
    if (existingUser.rows.length > 0) {
      throw new ConflictException('Login already exists');
    }

    // Проверка существования сотрудника (если указан)
    if (createDto.employee_id) {
      const employeeCheck = await pool.query(
        'SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL',
        [createDto.employee_id]
      );
      if (employeeCheck.rows.length === 0) {
        throw new NotFoundException(`Employee with ID ${createDto.employee_id} not found`);
      }
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(createDto.password, this.saltRounds);

    const query = `
      INSERT INTO users (employee_id, last_name, first_name, middle_name, login, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, employee_id, last_name, first_name, middle_name, login, role, created_at, updated_at
    `;
    const result = await pool.query(query, [
      createDto.employee_id || null,
      createDto.last_name,
      createDto.first_name,
      createDto.middle_name || null,
      createDto.login,
      passwordHash,
      createDto.role,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT id, employee_id, last_name, first_name, middle_name, login, role, created_at, updated_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async findOne(id: string) {
    const query = `
      SELECT id, employee_id, last_name, first_name, middle_name, login, role, created_at, updated_at
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async findByLogin(login: string) {
    const query = `
      SELECT * FROM users
      WHERE login = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [login]);
    return result.rows[0];
  }

  async update(id: string, updateDto: UpdateUserDto) {
    await this.findOne(id);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateDto)) {
      if (value !== undefined && key !== 'password') {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (updateDto.password) {
      const passwordHash = await bcrypt.hash(updateDto.password, this.saltRounds);
      fields.push(`password_hash = $${paramIndex++}`);
      values.push(passwordHash);
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id, employee_id, last_name, first_name, middle_name, login, role, created_at, updated_at
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: string): Promise<void> {
    const query = `
      UPDATE users
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async validateUser(login: string, password: string) {
    const user = await this.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Возвращаем пользователя без пароля
    const { password_hash, ...result } = user;
    return result;
  }
}