exports.up = async (pgm) => {
  pgm.createTable('operation_history', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
    },
    entity_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    entity_id: {
      type: 'uuid',
      notNull: true,
    },
    changed_fields: {
      type: 'jsonb',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('operation_history', 'user_id', {
    name: 'idx_operation_history_user_id',
  });
  pgm.createIndex('operation_history', 'entity_type', {
    name: 'idx_operation_history_entity_type',
  });
  pgm.createIndex('operation_history', 'entity_id', {
    name: 'idx_operation_history_entity_id',
  });
  pgm.createIndex('operation_history', 'created_at', {
    name: 'idx_operation_history_created_at',
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('operation_history');
};