exports.up = async (pgm) => {
  pgm.createTable('files', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    file_path: {
      type: 'varchar(500)',
      notNull: true,
    },
    employee_id: {
      type: 'uuid',
      notNull: true,
      references: 'employees(id)',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
    deleted_at: {
      type: 'timestamp',
    },
  });

  pgm.createIndex('files', 'employee_id', {
    name: 'idx_files_employee_id',
  });
  pgm.createIndex('files', 'deleted_at', {
    name: 'idx_files_deleted_at',
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('files');
};