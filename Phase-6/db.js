import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER, // username
  host: process.env.HOST, // host name
  database: process.env.DB_NAME, // db name
  password: process.env.DB_PASSWORD, // password
  port: process.env.DB_PORT || 5432,
});

// Get all customers
const getCustomers = async () => {
  const result = await pool.query("SELECT * FROM customers");
  return result.rows;
};

// Create a new customer
const createCustomer = async (id, name) => {
  const result = await pool.query(
    "INSERT INTO customers (cust_id, cust_name) VALUES ($1, $2) RETURNING *",
    [id, name]
  );
  return result.rows[0]; // return the inserted user
};

// Export pool + query functions
export { pool, getCustomers, createCustomer };
