exports.up = async (pgm) => {
  pgm.renameTable('personnel_operations', 'personal_operations');
};

exports.down = async (pgm) => {
  pgm.renameTable('personal_operations', 'personnel_operations');
};