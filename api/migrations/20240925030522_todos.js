/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//we declare the strucutre of db 
exports.up = async function(knex) {
  await knex.schema.createTable(
    'todos',
    tbl=>{
        tbl.increments();
        tbl.text('title',256).notNullable();
        tbl.text('status',200).notNullable();
    }
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('todos');
};
