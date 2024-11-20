require("dotenv").config();
const pg = require("pg");
// setup server
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store_db"
);

// unique keys
const uuid = require("uuid");

const createTables = async () => {
    const SQL = /* sql */ `
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS favorites;

        CREATE TABLE users;
        id UUID PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL

        CREATE TABLE products;
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,

        CREATE TABLE favorites;
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
    `;
    await client.query(SQL);
};



module.exports = {
    client
};