import knex from 'knex';

export const sqlite = knex({
    client: 'better-sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,

});

sqlite.schema.createTable('userData', function (table) {
    table.increments();
    table.string('name');
    table.timestamps();
})