class CreateIdeasTable1680522928352 {
  async up(queryRunner) {
    const checkExist = await queryRunner.hasTable('idea');
    if (checkExist) {
      return;
    }

    await queryRunner.query(`
      CREATE TABLE idea (
        id CHAR(36) NOT NULL PRIMARY KEY,
        idea TEXT NOT NULL,
        description TEXT NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      );
    `);
  }

  async down(queryRunner) {
    await queryRunner.dropTable('idea');
  }
}

module.exports = CreateIdeasTable1680522928352;
