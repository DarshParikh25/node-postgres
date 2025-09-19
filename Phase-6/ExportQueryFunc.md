# Export Query Functions

## Introduction

- Instead of writing raw queries everywhere in your project (routes, controllers, services), a **better practice** is to create **dedicated functions** in a database utility file.

- For example:

  - `getUsers()` → returns all users.
  - `createUser(name, email)` → inserts a new user.

- This keeps queries:
  1. **Organized** → one place for all database logic.
  2. **Reusable** → same function can be called in multiple routes/services.
  3. **Easier to test** → you can test these functions independently.

## Example: `db.js`:

- We expand the previous `db.js` to include query functions.

```javascript
// db.js
import { Pool } from "pg";

const pool = new Pool({
  user: "your_db_user",
  host: "localhost",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432,
});

// Exported Query Functions

// 1. Get all users
const getUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

// 2. Create a new user
const createUser = async (name, email) => {
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0]; // return the inserted user
};

// Export pool + query functions
export { pool, getUsers, createUser };
```

## How to Use in Other Files?

- Example usage inside `app.js`:

```javascript
// app.js
import { getUsers, createUser } from "./db.js";

const run = async () => {
  // 1. Create a new user
  const newUser = await createUser("Niranjan", "niranjan@example.com");
  console.log("New User:", newUser);

  // 2. Get all users
  const users = await getUsers();
  console.log("All Users:", users);
};

run();
```

## Flow Explanation

1. `db.js` holds query logic (SQL + parameters).
2. Functions like `getUsers` / `createUser` are **exported**.
3. Other parts of the app (`app.js`, API routes, services) **import and call these functions**.
4. This separation ensures **clear structure**:
   - **db.js** = all DB logic
   - **routes/controllers** = only business logic
