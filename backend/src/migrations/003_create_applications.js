exports.up = function (knex) {
  return knex.schema.createTable('applications', (table) => {
    table.uuid('id').primary();
    table.uuid('applicant_id').references('id').inTable('applicants').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('visa_category_id').notNullable();
    table.string('status').notNullable().defaultTo('draft');
    table.integer('eligibility_score');
    table.json('risk_flags').defaultTo('[]');
    table.json('compiled_package');
    table.json('audit_trail').defaultTo('[]');
    table.timestamp('submitted_at');
    table.timestamp('reviewed_at');
    table.timestamp('decided_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('applicant_id');
    table.index('status');
    table.index('visa_category_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('applications');
};
