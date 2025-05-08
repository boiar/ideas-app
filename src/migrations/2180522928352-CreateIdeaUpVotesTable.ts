import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIdeaUpVotesTable2180522946452
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const checkExist = await queryRunner.hasTable('user_bookmarks_idea');
    if (checkExist) {
      return;
    }

    queryRunner.query(`
        CREATE TABLE idea_upvotes_user
        (
            ideaId CHAR(36) NOT NULL,
            userId CHAR(36) NOT NULL,
            PRIMARY KEY (ideaId, userId),
            CONSTRAINT FK_d08e4b67dd2f23ea484a78fd8af
                FOREIGN KEY (ideaId) REFERENCES idea(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
            CONSTRAINT FK_5da87a862c47889e7a78be75332
                FOREIGN KEY (userId) REFERENCES users(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
        );

        CREATE INDEX IDX_d08e4b67dd2f23ea484a78fd8a
            ON idea_upvotes_user (ideaId);

        CREATE INDEX IDX_5da87a862c47889e7a78be7533
            ON idea_upvotes_user (userId);


    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

module.exports = CreateIdeaUpVotesTable2180522946452;
