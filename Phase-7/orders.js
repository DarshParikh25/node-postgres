import pool from "./db.js";

const createOrder = async (req, res) => {
  const { order_id, customer_id, product_name, quantity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (order_id, customer_id, product_name, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
      [order_id, customer_id, product_name, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllOrders = async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  const { order_id } = req.params;
  const { product_name, quantity } = req.body;
  try {
    const result = await pool.query(
      "UPDATE orders SET product_name = $1, quantity = $2 WHERE order_id = $3 RETURNING *",
      [product_name, quantity, order_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE order_id = $1 RETURNING *",
      [order_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createOrder, getAllOrders, updateOrder, deleteOrder };
