import pool from "./db.js";

import { createCustomer } from "./customers.js";

const welcomeVoucher = async (req, res) => {
  const { cust_name, voucher_id, id, name, date } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const customer = await client.query(
      "INSERT INTO customers (cust_id, cust_name) VALUES ($1, $2) RETURNING *",
      [id, cust_name]
    );

    const information = await client.query(
      "INSERT INTO welcome_vouchers (voucher_id, cust_id, voucher_name, expiry) VALUES ($1, $2, $3, $4) RETURNING *",
      [voucher_id, id, name, date]
    );

    const newCustomer = customer.rows[0];
    const voucher = information.rows[0];

    await client.query("COMMIT");

    res.status(201).json({
      customer: newCustomer,
      voucher,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export default welcomeVoucher;
