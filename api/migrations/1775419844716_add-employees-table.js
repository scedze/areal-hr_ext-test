exports.up = async (pgm) => {
  pgm.createTable('employees', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
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
    birth_date: {
      type: 'date',
    },
    passport_series: {
      type: 'varchar(10)',
    },
    passport_number: {
      type: 'varchar(20)',
    },
    passport_issue_date: {
      type: 'date',
    },
    passport_department_code: {
      type: 'varchar(20)',
    },
    passport_issued_by: {
      type: 'varchar(255)',
    },
    registration_region: {
      type: 'varchar(100)',
    },
    registration_locality: {
      type: 'varchar(100)',
    },
    registration_street: {
      type: 'varchar(100)',
    },
    registration_house: {
      type: 'varchar(20)',
    },
    registration_building: {
      type: 'varchar(20)',
    },
    registration_apartment: {
      type: 'varchar(20)',
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

  pgm.createIndex('employees', 'deleted_at', {
    name: 'idx_employees_deleted_at',
  });
  pgm.createIndex('employees', 'last_name', {
    name: 'idx_employees_last_name',
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('employees');
};