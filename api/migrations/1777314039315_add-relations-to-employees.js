exports.up = async (pgm) => {
  pgm.addColumn('employees', {
    department_id: { type: 'uuid', references: 'departments(id)', onDelete: 'SET NULL' },
    position_id: { type: 'uuid', references: 'positions(id)', onDelete: 'SET NULL' },
    organization_id: { type: 'uuid', references: 'organizations(id)', onDelete: 'SET NULL' },
  });
};

exports.down = async (pgm) => {
  pgm.dropColumn('employees', 'department_id');
  pgm.dropColumn('employees', 'position_id');
  pgm.dropColumn('employees', 'organization_id');
};