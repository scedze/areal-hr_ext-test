exports.up = async (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    employee_id: {
      type: 'uuid',
      references: 'employees(id)',
      onDelete: 'SET NULL',
    },
    last_name: {
      type: 'varchar(100)',
      notNull: true,
    },
    first_name: {
      type: 'varchar(100)',
      notNull: true,
    },
    middle_name: {
      type: 'varchar(100)',
    },
    login: {
      type: 'varchar(100)',
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: 'varchar(255)',
      notNull: true,
    },
    role: {
      type: 'varchar(50)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
    deleted_at: {
      type: 'timestamp',
    },
  });

  pgm.createIndex('users', 'login', { name: 'idx_users_login' });
  pgm.createIndex('users', 'role', { name: 'idx_users_role' });
  pgm.createIndex('users', 'employee_id', { name: 'idx_users_employee_id' });
};

exports.down = async (pgm) => {
  pgm.dropTable('users');
};