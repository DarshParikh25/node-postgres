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

async function placeOrder(orderId, custID, product, quantity) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    await client.query(
      "INSERT INTO orders (order_id, customer_id, product_name, quantity) VALUES ($1, $2, $3, $4)",
      [orderId, custID, product, quantity]
    );

    await client.query(
      "UPDATE orders SET quantity = quantity - $1 WHERE order_id = $2",
      [quantity, orderId]
    );

    await client.query("COMMIT"); // Finalize transaction
    console.log("Order placed successfully");
  } finally {
    client.release(); // Release back to pool
  }
}

placeOrder(105, 5, "Sneakers", 3);
