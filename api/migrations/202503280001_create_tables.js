exports.up = async (pgm) => {
    pgm.createTable('organizations', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        comment: {
            type: 'text',
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

    pgm.createTable('departments', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        organization_id: {
            type: 'uuid',
            notNull: true,
            references: 'organizations(id)',
            onDelete: 'restrict',
        },
        parent_id: {
            type: 'uuid',
            references: 'departments(id)',
            onDelete: 'restrict',
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        comment: {
            type: 'text',
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
    
    pgm.createTable('positions', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: {
            type: 'varchar(255)',
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

    pgm.createIndex('organizations', 'deleted_at', {
        name: 'idx_organizations_deleted_at',
    });
    pgm.createIndex('departments', 'organization_id', {
        name: 'idx_departments_organization_id',
    });
    pgm.createIndex('departments', 'parent_id', {
        name: 'idx_departments_parent_id',
    });
    pgm.createIndex('departments', 'deleted_at', {
        name: 'idx_departments_deleted_at',
    });
    pgm.createIndex('positions', 'deleted_at', {
        name: 'idx_positions_deleted_at',
    });

    pgm.createFunction(
        'update_updated_at_column',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
        },
        `
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        `
    );

    pgm.createTrigger('organizations', 'update_organizations_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });
    pgm.createTrigger('departments', 'update_departments_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });
    pgm.createTrigger('positions', 'update_positions_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        function: 'update_updated_at_column',
        level: 'ROW',
    });
};