import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  max: 10, // maximum connections
  user: process.env.DB_USER, // username
  host: process.env.HOST, // host name
  database: process.env.DB_NAME, // db name
  password: process.env.DB_PASSWORD, // password
  port: process.env.DB_PORT || 5432,
});

const addUser = async (id, name) => {
  // Manually connect and release from pool
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO customers (cust_id, cust_name) VALUES ($1, $2)",
      [id, name]
    );
  } finally {
    client.release();
  }
};

const getAllUsers = async () => {
  // Using pool.query() directly
  const res = await pool.query("SELECT * FROM customers");
  console.log(res.rows);
};

const shutdown = async () => {
  console.log("Closing pool...");
  await pool.end();
};

addUser(7, "Sujal");
getAllUsers().then(shutdown); // Call only when your entire app shuts down
