import { getCustomers, createCustomer } from "./db.js";

const run = async () => {
  // Create a new customer
  const newUser = await createCustomer(8, "Niranjan");
  console.log("New User:", newUser);

  // Get all customers
  const users = await getCustomers();
  console.log("All Users:", users);
};

run();
