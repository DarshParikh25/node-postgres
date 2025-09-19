import { getCustomers, createCustomer } from "./db.js";

const run = async () => {
  // Create a new customer
  const newCustomer = await createCustomer(8, "Niranjan");
  console.log("New User:", newCustomer);

  // Get all customers
  const customers = await getCustomers();
  console.log("All Users:", customers);
};

run();
