exports.up = async (pgm) => {
    pgm.createtable('organizations', {
        id:{
            type:'uuid',
            primarykey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name:{
            type: 'uuid',
            notnull: true,
        },
        comment:{
            type: 'text',
        },
        created_at:{
            type: 'timestamp',
            default: pgm.func('now()'),
        },
        updated_at:{
            type: 'timestamp',
            default: pgm.func('now()'),
        },
        deleted_at:{
            type: 'timestamp',
        },
    });

    pgm.createtable('departments', {
        id:{
            type: 'uuid',
            primarykey: true,
            default: pgm.func('gen_random_uuid()'),
        },   
        organization_id:{
            type: 'uuid',
            notnull: true,
            references: 'organizations(id)',
            ondelete: 'restrict',
        },
        parent_id:{
            type: 'uuid',
            references: 'departments(id)',
            ondelete: 'restrict',
        },
        name:{
            type: 'varchar(255)',
            notnull: true,
        },
        comment:{
            type: 'text',
        },
        created_at:{
            type: 'timestamp',
            default: pgm.func('now()'),
        },
        updated_at:{
            type: 'timestamp',
            default: pgm.func('now()'),
        },
        deleted_at:{
            type: 'timestamp',
        },     
    });
    pgm.createtable('position', {
        id:{
            type: 'uuid',
            primarykey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name:{
            type: 'varchar(255)',
            notnull: true,
        },
        created_at:{
            type: 'timestamp',
            default: pgm.func('now()'),
        },
        updated_at:{
            type: 'timestamp',
            default: pgm.func('now()'),
        },
        deleted_at:{
            type: 'timestamp',
        },
    });

    pgm.createindex('organizations', 'deleted_at', {
        name: 'idx_organizations_deleted_at',
    });
    pgm.createindex('departments', 'organization_id', {
        name: 'idx_departments_organization_id',
    });
    pgm.createindex('departments', 'parent_id', {
        name: 'idx_departments_parent_id',
    });
    pgm.createindex('departments', 'deleted_at', {
        name: 'idx_departments_deleted_at',
    });
    pgm.createindex('position', 'deleted_at', {
        name: 'idx_position_deleted_at',
    });
}