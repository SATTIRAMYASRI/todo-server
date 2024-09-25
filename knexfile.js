// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './api/todos.db3'
    },
    migrations: { // what columns we want in db
      directory:'./api/migrations'
    },
    seeds:{
      directory:'./api/seeds'
    },
    useNullAsDefault:true,
  },
};
