import type { Knex } from 'knex';
import knex from 'knex';

declare module 'knex/types/tables' {
  interface Tables {
    userData: {
      id: string;
      user: string;
      color: string;
      text: string;
      screenY: number;
      screenX: number;
    };
  }
}

const sqlite = knex({
  client: 'better-sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
});

export const initDb = async (): Promise<Knex> => {
  await sqlite.schema
    .hasTable('userData')
    .then(async function (exists: boolean) {
      if (!exists) {
        await sqlite.schema.createTable(
          'userData',
          function (table: Knex.CreateTableBuilder) {
            table.string('id').index().primary();
            table.string('user').index();
            table.string('text');
            table.string('color');
            table.integer('screenY');
            table.integer('screenX');
          }
        );
      }
    });

  return sqlite;
};
