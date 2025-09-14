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
  const res = await pool.query(
    "INSERT INTO customers (cust_id, cust_name) VALUES ($1, $2) RETURNING *",
    [7, "Farhaan"]
  );
  console.log(res.rows);
  // OUTPUT: [ { cust_id: 7, cust_name: 'Farhaan' } ]

  const del = await pool.query(
    "DELETE FROM customers WHERE cust_id = $1 AND cust_name = $2 RETURNING cust_name, cust_id",
    [7, "Farhaan"]
  );
  console.log(del.rows);

  // OUTPUT: [ { cust_name: 'Farhaan', cust_id: 7 } ]
};

main();
