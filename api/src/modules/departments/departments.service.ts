import {
  Injectable,
  NotAcceptableException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { pool } from '../../database/pool';
@Injectable()
export class DepartmentsService {
  async create(data: {
    name: string;
    organization_id: string;
    parent_id?: string | null;
    comment?: string | null;
  }) {
    const orgCheck = await pool.query(
      'SELECT id FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [data.organization_id],
    );
    if (orgCheck.rows.length === 0) {
      throw new BadRequestException('Organization not found');
    }
    if (data.parent_id) {
      const parentCheck = await pool.query(
        'SELECT id, organization_id FROM departments WHERE id = $1 AND deleted_at IS NULL',
        [data.parent_id],
      );
      if (parentCheck.rows.length === 0) {
        throw new BadRequestException('Parent department not found');
      }
      if (parentCheck.rows[0].organization_id !== data.organization_id) {
        throw new BadRequestException('Parent department must belong to the same organization');
      }
    }
    const query = `
            INSERT INTO departments(name, organization_id, parent_id, comment)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at
        `;
    const result = await pool.query(query, [
      data.name,
      data.organization_id,
      data.parent_id || null,
      data.comment || null,
    ]);
    return result.rows[0];
  }
  async findAll() {
    const query = `
            SELECT d.id, d.name, d.organization_id, d.parent_id, d.comment,
                d.created_at, d.updated_at,
                o.name as organization_name
            FROM departments d
            LEFT JOIN organizations o ON o.id = d.organization_id
            WHERE d.deleted_at IS NULL
            ORDER BY d.created_at DESC
        `;
    const result = await pool.query(query);
    return result.rows;
  }
  async findTree() {
    const query = `
            SELECT id, name, parent_id, organization_id, comment
            FROM departments
            WHERE deleted_at IS NULL
            ORDER BY name
        `;
    const result = await pool.query(query);
    const departments = result.rows;
    const map = new Map();
    const roots: any[] = [];
    departments.forEach((dept) => {
      map.set(dept.id, { ...dept, children: [] });
    });
    departments.forEach((dept) => {
      const node = map.get(dept.id);
      if (dept.parent_id && map.has(dept.parent_id)) {
        const parent = map.get(dept.parent_id);
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }
  async findByOrganization(organizationId: string) {
    const query = `
            SELECT id, name, parent_id, comment, created_at, updated_at
            FROM departments
            WHERE organization_id = $1 AND deleted_at IS NULL
            ORDER BY name
        `;
    const result = await pool.query(query, [organizationId]);
    return result.rows;
  }
  async findOne(id: string) {
    const query = `
            SELECT d.id, d.name, d.organization_id, d.parent_id, d.comment,
                d.created_at, d.updated_at,
                o.name as organization_name,
                p.name as parent_name
            FROM departments d
            LEFT JOIN organizations o ON o.id = d.organization_id
            LEFT JOIN departments p ON p.id = d.parent_id
            WHERE d.id = $1 AND d.deleted_at IS NULL
        `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Department with ID${id} not found`);
    }
    return result.rows[0];
  }
  async update(
    id: string,
    data: { name?: string; parent_id?: string | null; comment?: string | null },
  ) {
    const department = await this.findOne(id);
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.comment !== undefined) {
      updates.push(`comment = $${paramIndex++}`);
      values.push(data.comment);
    }
    if (data.parent_id !== undefined) {
      if (data.parent_id === id) {
        throw new BadRequestException('Department cannot be parent of itself');
      }
      if (data.parent_id) {
        const parentCheck = await pool.query(
          'SELECT id, organization_id FROM departments WHERE id = $1 AND deleted_at IS NULL',
          [data.parent_id],
        );
        if (parentCheck.rows.length === 0) {
          throw new BadRequestException('Parent department not found');
        }
        if (parentCheck.rows[0].organization_id !== department.organization_id) {
          throw new BadRequestException('Parent department must belong to the same organization');
        }
      }
      updates.push(`parent_id = $${paramIndex++}`);
      values.push(data.parent_id);
    }
    if (updates.length === 0) {
      return this.findOne(id);
    }
    values.push(id);
    const query = `
            UPDATE departments
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex} AND deleted_at IS NULL
            RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at
        `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async remove(id: string) {
    const childrenCheck = await pool.query(
      'SELECT id FROM departments WHERE parent_id = $1 AND deleted_at IS NULL',
      [id],
    );
    if (childrenCheck.rows.length > 0) {
      throw new BadRequestException(
        'Cannot delete department with children. Delete children first',
      );
    }
    const query = `
            UPDATE departments
            SET deleted_at = NOW()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id
        `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`department with Id ${id} not found`);
    }
    return { success: true, message: 'Department soft deleted' };
  }
  async restore(id: string) {
    const query = `
            UPDATE departments
            SET deleted_at = NULL
            WHERE id = $1
            RETURNING id, name, organization_id, parent_id, comment, created_at, updated_at
        `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`Department with Id ${id} not found`);
    }
    return result.rows[0];
  }
}
