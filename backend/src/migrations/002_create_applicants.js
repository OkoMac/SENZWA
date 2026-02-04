exports.up = function (knex) {
  return knex.schema.createTable('applicants', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('passport_number');
    table.string('nationality');
    table.string('country_of_origin');
    table.date('date_of_birth');
    table.string('gender');
    table.string('marital_status');
    table.string('purpose_of_stay');
    table.string('intended_duration');
    table.json('qualifications').defaultTo('[]');
    table.json('employment_history').defaultTo('[]');
    table.json('family_ties_in_sa');
    table.json('financial_standing');
    table.string('current_visa_status').defaultTo('none');
    table.boolean('onboarding_complete').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique('user_id');
    table.index('nationality');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('applicants');
};
