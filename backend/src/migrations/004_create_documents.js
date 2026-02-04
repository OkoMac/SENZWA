exports.up = function (knex) {
  return knex.schema.createTable('documents', (table) => {
    table.uuid('id').primary();
    table.uuid('application_id').references('id').inTable('applications').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable();
    table.string('file_name').notNullable();
    table.string('file_path').notNullable();
    table.string('mime_type');
    table.integer('file_size');
    table.string('validation_status').defaultTo('pending');
    table.json('validation_errors').defaultTo('[]');
    table.json('extracted_data');
    table.date('expiry_date');
    table.integer('version').defaultTo(1);
    table.timestamp('uploaded_at').defaultTo(knex.fn.now());
    table.timestamp('validated_at');

    table.index('application_id');
    table.index('user_id');
    table.index('type');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('documents');
};
