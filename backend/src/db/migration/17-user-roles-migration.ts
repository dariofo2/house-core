import { createHash } from 'node:crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bc from 'bcrypt';

export class Migration17userRoles implements MigrationInterface {
  name = 'Migration1767383173435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = createHash('sha256')
      .update(Buffer.from('admin', 'utf8'))
      .digest('hex');
    //const password = hash('sha256', Buffer.from('admin', 'utf-8'));
    const hashBcrypt = await bc.hash(password, 4);

    await queryRunner.query(
      `INSERT into "user" (name, password, email) VALUES ('admin','${hashBcrypt}','admin@admin.es')`,
    );

    await queryRunner.query(
      `INSERT into "role" (name, description) VALUES ('admin','Admin Role. Has privileged Access to Everything. In User grants FULL ACCESS. In House grants FULL ACCESS'), ('user','User Role. In User Can Make Houses (Own Houses is Admin House Role Default) and Access To Houses Allowed. In House grants capacity of adding things, never delete'), ('visitor','Visitor Role. In User Can do nothing. In House grants Visitor, only Read')`,
    );

    await queryRunner.query(
      `INSERT into "user_role" ("userId", "roleId") VALUES ('1','1')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE from "role" where name='admin' OR name='user' OR name='invited'`,
    );

    await queryRunner.query(`DELETE from "user" where name='admin'`);
  }
}
