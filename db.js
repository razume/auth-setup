const { Client } = require('pg');

const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/acme_auth_db');

client.connect();

const sync = async()=> {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS users;
  CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    CHECK (char_length(username) > 0)
  );
  `;
  await client.query(SQL);
  const [lucy, moe] = await Promise.all([
    createUser({ username: 'moe', password: 'MOE'}),
    createUser({ username: 'lucy', password: 'LUCY'}),
    createUser({ username: 'curly', password: 'CURLY'})
  ]);
};

const createUser = async({ username, password })=> {
  const hashed = await hash(password);
  return (await client.query('INSERT INTO users(username, password) values ($1, $2) returning *', [ username, hashed])).rows[0];
};

//TODO
const hash = (plain)=> {
  return plain;
};


module.exports = {
  sync
};
