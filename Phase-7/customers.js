import pool from "./db.js";

// Get all customers
const getCustomers = async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new customer
const createCustomer = async (req, res) => {
  const { id, cust_name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO customers (cust_id, cust_name) VALUES ($1, $2) RETURNING *",
      [id, cust_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update existing customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE customers SET cust_name = $1 WHERE cust_id = $2 RETURNING *",
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export query functions
export { getCustomers, createCustomer, updateCustomer };
