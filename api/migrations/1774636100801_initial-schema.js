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
}