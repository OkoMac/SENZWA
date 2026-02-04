exports.up = function (knex) {
  return knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary();
    table.string('method');
    table.string('path');
    table.string('ip');
    table.text('user_agent');
    table.uuid('user_id');
    table.integer('status_code');
    table.integer('response_time');
    table.timestamp('timestamp').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('timestamp');
    table.index('path');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};
