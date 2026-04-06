exports.up = async (pgm) => {
  pgm.createTable('personnel_operations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    employee_id: {
      type: 'uuid',
      notNull: true,
      references: 'employees(id)',
      onDelete: 'restrict',
    },
    operation_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    department_id: {
      type: 'uuid',
      references: 'departments(id)',
      onDelete: 'restrict',
    },
    position_id: {
      type: 'uuid',
      references: 'positions(id)',
      onDelete: 'restrict',
    },
    salary: {
      type: 'decimal(10,2)',
    },
    operation_date: {
      type: 'date',
      notNull: true,
      default: pgm.func('CURRENT_DATE'),
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
    deleted_at: {
      type: 'timestamp',
    },
  });

  pgm.createIndex('personnel_operations', 'employee_id', {
    name: 'idx_personnel_operations_employee_id',
  });
  pgm.createIndex('personnel_operations', 'operation_type', {
    name: 'idx_personnel_operations_type',
  });
  pgm.createIndex('personnel_operations', 'deleted_at', {
    name: 'idx_personnel_operations_deleted_at',
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('personnel_operations');
};