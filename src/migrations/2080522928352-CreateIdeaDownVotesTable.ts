import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIdeaDownVotesTable2080522946452
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const checkExist = await queryRunner.hasTable('user_bookmarks_idea');
    if (checkExist) {
      return;
    }

    queryRunner.query(`
        CREATE TABLE idea_downvotes_user
        (
            ideaId CHAR(36) NOT NULL,
            userId CHAR(36) NOT NULL,
            PRIMARY KEY (ideaId, userId),
            CONSTRAINT FK_de10a42d0bcf83a6e913ebc893f
                FOREIGN KEY (ideaId) REFERENCES idea(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
            CONSTRAINT FK_8ab050e2633941e8c038ba4c5b7
                FOREIGN KEY (userId) REFERENCES users(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
        );

        CREATE INDEX IDX_de10a42d0bcf83a6e913ebc893
            ON idea_downvotes_user (ideaId);

        CREATE INDEX IDX_8ab050e2633941e8c038ba4c5b
            ON idea_downvotes_user (userId);

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

module.exports = CreateIdeaDownVotesTable2080522946452;
