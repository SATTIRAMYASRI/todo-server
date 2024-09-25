/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('todos').del()
  await knex('todos').insert([
    {
      title: "Complete React Project",
      status: "in progress",
    },
    {
      title: "Grocery Shopping",
      status: "pending",
    },
    {
      title: "Prepare Presentation",
      status: "done",
    }
  ]);
};
