import express from "express";
import { getCustomers, createCustomer } from "../db.js";

const router = express.Router();

// GET /users → fetch all customers
router.get("/", async (_, res) => {
  try {
    const customers = await getCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users → create a new customer
router.post("/", async (req, res) => {
  try {
    const { id, name } = req.body;
    const newCustomer = await createCustomer(id, name);
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
