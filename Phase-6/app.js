import express from "express";
import customersRouter from "./routes/customers.js";

const app = express();
app.use(express.json()); // Middleware to parse JSON body

// Register routes
app.use("/customers", customersRouter);

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
