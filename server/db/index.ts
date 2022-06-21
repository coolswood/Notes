import knex from 'knex';
import type {Knex} from 'knex';

const sqlite = knex({
    client: 'better-sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
});

export const initDb = async (): Promise<Knex> => {

    await sqlite.schema
        .hasTable('userName')
        .then(async function (exists: boolean) {
            if (!exists) {
                await sqlite.schema.createTable(
                    'userName',
                    function (table: Knex.CreateTableBuilder) {
                        table.increments();
                        table.string('user');
                    });
            }
        });

    await sqlite.schema
        .hasTable('userData')
        .then(async function (exists: boolean) {
            if (!exists) {
                await sqlite.schema.createTable(
                    'userData',
                    function (table: Knex.CreateTableBuilder) {
                        table.increments();
                        table.string('user');
                        table.string('text');
                        table.string('screenY');
                        table.string('screenX');
                    });
            }
        });

    return sqlite;
}