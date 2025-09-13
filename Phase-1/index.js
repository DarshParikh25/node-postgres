import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  user: process.env.DB_USER, // username
  host: process.env.HOST, // host name
  database: process.env.DB_NAME, // db name
  password: process.env.DB_PASSWORD, // password
  port: process.env.DB_PORT || 5432,
});

const main = async () => {
  try {
    // connect to DB
    await client.connect();

    // run test query
    const res = await client.query("SELECT NOW()");

    // check result
    console.log(res.rows);
  } catch (error) {
    // if error, print it
    console.log(`Error: ${error}`);
  } finally {
    // close connection
    await client.end();
  }
};

main();

// OUTPUT: [ { now: 2025-09-12T10:28:14.823Z } ]
