import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserBookmarksTable1980522946452
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const checkExist = await queryRunner.hasTable('user_bookmarks_idea');
    if (checkExist) {
      return;
    }

    queryRunner.query(`
        CREATE TABLE user_bookmarks_idea
        (
            userId CHAR(36) NOT NULL,
            ideaId CHAR(36) NOT NULL,
            PRIMARY KEY (userId, ideaId),
            CONSTRAINT FK_57a5c456ea2f8aa6b74dc8eb230
                FOREIGN KEY (userId) REFERENCES users (id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
            CONSTRAINT FK_99eeae9c25ea8532138978937ce
                FOREIGN KEY (ideaId) REFERENCES idea (id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
        );

        CREATE INDEX IDX_57a5c456ea2f8aa6b74dc8eb23
            ON user_bookmarks_idea (userId);

        CREATE INDEX IDX_99eeae9c25ea8532138978937c
            ON user_bookmarks_idea (ideaId);

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

module.exports = CreateUserBookmarksTable1980522946452;
