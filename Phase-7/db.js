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

export default pool;
