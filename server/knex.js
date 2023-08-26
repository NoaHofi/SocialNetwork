const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './network.db',
    },
    useNullAsDefault: true,
  });
  
  module.exports = knex;
  