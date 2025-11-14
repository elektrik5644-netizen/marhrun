exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('phone', 15).unique().notNullable();
      table.string('email', 255);
      table.string('password', 255).notNullable();
      table.string('first_name', 50).notNullable();
      table.string('last_name', 50).notNullable();
      table.enum('role', ['passenger', 'driver', 'admin']).defaultTo('passenger');
      table.string('avatar_url', 255);
      table.boolean('is_verified').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('vehicles', function(table) {
      table.increments('id').primary();
      table.integer('driver_id').unsigned().references('id').inTable('users');
      table.string('model', 100).notNullable();
      table.string('license_plate', 20).unique().notNullable();
      table.string('color', 30);
      table.integer('year');
      table.integer('capacity').notNullable();
      table.timestamps(true, true);
    })
    .createTable('routes', function(table) {
      table.increments('id').primary();
      table.string('departure_city', 100).notNullable();
      table.text('departure_address').notNullable();
      table.decimal('departure_lat', 10, 8).notNullable();
      table.decimal('departure_lng', 11, 8).notNullable();
      table.string('arrival_city', 100).notNullable();
      table.text('arrival_address').notNullable();
      table.decimal('arrival_lat', 10, 8).notNullable();
      table.decimal('arrival_lng', 11, 8).notNullable();
      table.integer('duration_minutes').notNullable();
      table.decimal('base_price', 10, 2).notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('trips', function(table) {
      table.increments('id').primary();
      table.integer('route_id').unsigned().references('id').inTable('routes');
      table.integer('driver_id').unsigned().references('id').inTable('users');
      table.integer('vehicle_id').unsigned().references('id').inTable('vehicles');
      table.timestamp('departure_time').notNullable();
      table.timestamp('estimated_arrival_time');
      table.integer('available_seats').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.enum('status', ['scheduled', 'boarding', 'in_progress', 'completed', 'cancelled']).defaultTo('scheduled');
      table.timestamps(true, true);
    })
    .createTable('orders', function(table) {
      table.increments('id').primary();
      table.integer('passenger_id').unsigned().references('id').inTable('users');
      table.integer('trip_id').unsigned().references('id').inTable('trips');
      table.integer('seats').defaultTo(1);
      table.decimal('total_price', 10, 2).notNullable();
      table.enum('status', ['pending', 'confirmed', 'cancelled', 'refunded']).defaultTo('pending');
      table.enum('payment_method', ['cash', 'card']).notNullable();
      table.enum('payment_status', ['pending', 'paid', 'failed']).defaultTo('pending');
      table.timestamps(true, true);
    })
    .createTable('trip_locations', function(table) {
      table.increments('id').primary();
      table.integer('trip_id').unsigned().references('id').inTable('trips');
      table.decimal('latitude', 10, 8).notNullable();
      table.decimal('longitude', 11, 8).notNullable();
      table.decimal('speed', 5, 2);
      table.decimal('heading', 5, 2);
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('trip_locations')
    .dropTable('orders')
    .dropTable('trips')
    .dropTable('routes')
    .dropTable('vehicles')
    .dropTable('users');
};
