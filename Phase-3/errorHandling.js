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

const safeQuery = async () => {
  try {
    const res = await pool.query("SELECT * FROM non_existing_table");
    console.log(res);
  } catch (error) {
    console.log("Error object", error);

    // OUTPUT:
    // {
    //     length: 117,
    //     severity: 'ERROR',
    //     code: '42P01',
    //     detail: undefined,
    //     hint: undefined,
    //     position: '15',
    //     internalPosition: undefined,
    //     internalQuery: undefined,
    //     where: undefined,
    //     schema: undefined,
    //     table: undefined,
    //     column: undefined,
    //     dataType: undefined,
    //     constraint: undefined,
    //     file: 'parse_relation.c',
    //     line: '1452',
    //     routine: 'parserOpenTable'
    // }

    console.log(`Error message: ${error.message}`);

    // OUTPUT:
    // Error message: relation "non_existing_table" does not exist

    console.log(`Error constraint: ${error.constraint}`);

    // OUTPUT:
    // Error constraint: undefined

    console.log(`Error code: ${error.code}`);

    // OUTPUT:
    // Error code: 42P01

    // maybe send a response in an API:
    // res.status(500).json({ error: "Something went wrong!" });
  }
};

safeQuery();
