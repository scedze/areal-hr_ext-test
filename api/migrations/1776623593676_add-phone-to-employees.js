exports.up = async (pgm) => {
  pgm.addColumn('employees', {
    phone: { type: 'varchar(12)' },
  });
};

exports.down = async (pgm) => {
  pgm.dropColumn('employees', 'phone');
};