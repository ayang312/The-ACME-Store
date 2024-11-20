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

        CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

        CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );

        CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
    );
    `;
  await client.query(SQL);
};

// createUser async fxn
const createUser = async ({ username, password }) => {
  const SQL = /*sql*/ `
        INSERT INTO users(id, username, password) 
        VALUES($1, $2, $3) 
        RETURNING *
    `;
  const response = await client.query(SQL, [uuid4(), username, password]);
  return response.rows[0];
};

// createProduct async fxn
const createProduct = async ({ name }) => {
  const SQL = /* sql */ `
        INSERT INTO products(id, name)
        VALUES($1, $2)
        RETURNING *
    `;
  const response = await client.query(SQL, [uuid4(), name]);
  return response.rows[0];
};

// fetchUsers fxn
const fetchUsers = async () => {
  const SQL = /* sql */ `
        SELECT id, username, FROM users
    `;
  const response = await client.query(SQL);
  return response.rows;
};

// fetchProducts fxn
const fetchProducts = async () => {
  const SQL = /* sql */ `
        SELECT * FROM products
    `;
  const response = await client.query(SQL);
  return response.rows[0];
};

// createFavorite fxn
const createFavorite = async ({ product_id, user_id }) => {
  const SQL = /* sql */ `
        INSERT INTO favorites(id, product_id, user_id)
        VALUES($1, $2, $3)
        RETURNING *
    `;
  const response = await client.query(SQL, [uuid4(), product_id, user_id]);
  return response.rows[0];
};

// fetchFavorites fxn
const fetchFavorites = async (user_id) => {
  const SQL = /* sql */ `
        SELECT *
        FROM favorites
        WHERE user_id = $1
    `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

// destroyFavorite fxn
const destroyFavorite = async ({ id, user_id }) => {
  const SQL = /* sql */ `
        DELETE
        FROM favorites
        WHERE id = $1 and user_id = $2
    `;
  await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
