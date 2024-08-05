import { MigrationInterface, QueryRunner } from "typeorm";

export class seedDB1722333386230 implements MigrationInterface {
    name = 'seedDB1722333386230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO tags (name) VALUES ('mmd'), ('ali'), ('naghi')`);
        await queryRunner.query(`INSERT INTO users (username, email, password) VALUES ('user1', 'user1@gmail.com', '$2b$10$AZuCf6BiUIIPlr9J8H6xhuDkHhDlMPEJPrB3P3RCPvqUd8BtTKYMW'), ('user2', 'user2@gmail.com', '$2b$10$YL0mDcUCZbVh9ABdpCY.mOHy4T3wrW6/TXbicPavxza0S4seZEr3e'), ('user3', 'user3@gmail.com', '$2b$10$YFI6auS1SAqx2nZ538wkT.wq1UZXJvlcEcBAPVuv5d0dM/51ElPCK')`);
        await queryRunner.query(`INSERT INTO articles(slug, title, description, body, "tagList", "authorId") VALUES('first_article', 'first article', 'first des', 'first body', 'ali,mmd', 1), ('second_article', 'second article', 'second des', 'second body', 'ali,mmd', 1), ('third_article', 'third article', 'third des', 'third body', 'ali,mmd', 2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
