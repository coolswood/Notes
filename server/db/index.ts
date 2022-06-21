import knex from 'knex';
import type {Knex} from 'knex';

const sqlite = knex({
    client: 'better-sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
});

export const initDb = (): Promise<Knex> => {
    return sqlite.schema
        .hasTable('userData')
        .then(async function (exists: boolean) {
            if (!exists) {
                await sqlite.schema.createTable(
                    'userData',
                    function (table: Knex.CreateTableBuilder) {
                        table.increments();
                        table.string('name');
                        table.timestamps();
                    }
                );
            }

            return sqlite;
        });
}