import express from "express";
import { createCustomer, getCustomers, updateCustomer } from "./customers.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} from "./orders.js";

const app = express();
app.use(express.json());

const PORT = 3000;

app.post("/customers", createCustomer);
app.get("/customers", getCustomers);
app.put("/customers/:id", updateCustomer);

app.post("/orders", createOrder);
app.get("/orders", getAllOrders);
app.put("/orders/:order_id", updateOrder);
app.delete("/orders/:order_id", deleteOrder);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
