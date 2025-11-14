import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = isProduction ? {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: '../migrations'
  },
  pool: {
    min: 2,
    max: 10
  }
} : {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3'
  },
  useNullAsDefault: true,
  migrations: {
    directory: '../migrations'
  }
};

export const db = knex(dbConfig);
export default dbConfig;
