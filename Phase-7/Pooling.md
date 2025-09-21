# Pooling enabled for better performance

## Using Connection Pooling in a Project (Node.js + pg)

- When building an API with **Express** or **Fastify**, every request may need to talk to the database.
- Without pooling, each request creates a new connection, which is **slow and resource-heavy**.

- With pooling, we:
  1. Reuse a pool of pre-created connections.
  2. Avoid the overhead of creating/destroying connections repeatedly.
  3. Get better **throughput** and **scalability**.

## 1. Setup Pool Once (db.js)

```js
// db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "mypassword",
  port: 5432,
  max: 10, // max number of connections
  idleTimeoutMillis: 30000, // close idle clients after 30s
});

export default pool;
```

## 2. Use Pool Directly in Routes

```js
import express from "express";
import pool from "./db.js";

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

## 3. Where Pooling Helps in Project

1. **CRUD Endpoints** → All `GET`, `POST`, `PUT`, `DELETE` requests reuse the pool.
2. **Transactions** → Even inside transactions (`BEGIN`, `COMMIT`, `ROLLBACK`), we use `pool.connect()` safely.
3. **Scaling** → If your API gets 100s of requests/sec, pool ensures they are queued + executed efficiently.

### Key Takeaway

1. Pool is **global**, created once in `db.js`.
2. Reuse across your entire app (users, tasks, etc.).
3. Enables **high performance and stability**.
