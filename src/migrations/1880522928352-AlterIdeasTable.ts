class AlterIdeasTable1680522928352 {
  async up(queryRunner) {
    const checkExist = await queryRunner.hasColumn('idea', 'authorId');
    if (checkExist) {
      return;
    }

    await queryRunner.query(`
        ALTER TABLE idea
        ADD COLUMN authorId CHAR(36),
        ADD CONSTRAINT FK_67530863c810fc8fd60c3d59b4e
        FOREIGN KEY (authorId) REFERENCES users(id);
    `);
  }

  async down(queryRunner) {
    await queryRunner.dropTable('idea');
  }
}

module.exports = AlterIdeasTable1680522928352;
