import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Created only once and used all over the app
const pool = new Pool({
  user: process.env.DB_USER, // username
  host: process.env.HOST, // host name
  database: process.env.DB_NAME, // db name
  password: process.env.DB_PASSWORD, // password
  port: process.env.DB_PORT || 5432,
  max: 10, // max number of connections
  idleTimeoutMillis: 600000, // close idle clients after 1min
});

export default pool;
