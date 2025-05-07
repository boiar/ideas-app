class CreateUsersTable1780522928352 {
  async up(queryRunner) {
    const checkExist = await queryRunner.hasTable('users');
    if (checkExist) {
      return;
    }

    await queryRunner.query(`
      CREATE TABLE users (
         id CHAR(36) NOT NULL PRIMARY KEY,
         username VARCHAR(255) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL,
         created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
         updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      );
    `);
  }

  async down(queryRunner) {
    await queryRunner.dropTable('users');
  }
}

module.exports = CreateUsersTable1780522928352;
