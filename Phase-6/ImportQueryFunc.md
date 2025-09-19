# Import Query Functions into Routes

## Introduction

- Routes (like `/users`) should not contain raw SQL.
- Instead, they should **call the exported functions** from `db.js`.
- This keeps code **clean, testable, and easy to maintain**.

- We’ll demonstrate this with **Express.js (most popular)** using `db.js`, but the same applies to **Fastify, Koa, or any framework**.

## Example Project Structure

```bash
project/
│── db.js          # Database logic
│── app.js         # Express app setup
│── routes/
│    └── users.js  # User-related routes
```

## db.js (from previous step)

```javascript
import { Pool } from "pg";

const pool = new Pool({
  user: "your_db_user",
  host: "localhost",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432,
});

const getUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

const createUser = async (name, email) => {
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
};

export { pool, getUsers, createUser };
```

## routes/users.js (Using the query functions)

```js
import express from "express";
import { getUsers, createUser } from "../db.js";

const router = express.Router();

// GET /users → fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users → create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await createUser(name, email);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

## app.js (Main entry)

```js
import express from "express";
import usersRouter from "./routes/users.js";

const app = express();
app.use(express.json()); // Middleware to parse JSON body

// Register routes
app.use("/users", usersRouter);

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

## Flow Explanation

1. `db.js` = all database logic (`getUsers`, `createUser`).
2. `users.js` = Express routes call those functions.
   - `GET /users` → calls `getUsers()`
   - `POST /users` → calls `createUser(name, email)`
3. `app.js` = ties everything together, starts the server.

## Testing the Routes

1. **GET request** → `http://localhost:3000/users`

   - Returns all users.

2. **POST request** → `http://localhost:3000/users`
   - JSON body:
     ```json
     { "name": "Niranjan", "email": "niranjan@example.com" }
     ```
   - Returns the new user.
