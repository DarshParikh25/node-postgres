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

const main = async () => {
  await pool.query(
    "INSERT INTO customers (cust_id, cust_name) VALUES($1, $2)", // parameterized query (with $1, $2)
    ["5", "Jack"]
  );

  const res = await pool.query("SELECT * FROM customers");
  console.log(res.rows);

  // OUTPUT:
  //   [
  //     { cust_id: 2, cust_name: 'Kiran' },
  //     { cust_id: 3, cust_name: 'George' },
  //     { cust_id: 4, cust_name: 'Maria' },
  //     { cust_id: 1, cust_name: 'Raja' },
  //     { cust_id: 5, cust_name: 'Jack' }
  //   ]
};

main();
