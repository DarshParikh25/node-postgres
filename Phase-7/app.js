import express from "express";
import { createCustomer, getCustomers, updateCustomer } from "./customers.js";

const app = express();
app.use(express.json());

const PORT = 3000;

app.post("/customers", createCustomer);

app.get("/customers", getCustomers);

app.put("/customers/:id", updateCustomer);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
