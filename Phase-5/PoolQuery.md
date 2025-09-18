# Using `Pool.query` Directly

## What Does It Mean?

- The `pg.Pool` object has **two main ways** to run queries:

  1. **Borrow a client manually**

     - `pool.connect()` → gives you a client
     - run queries → `client.query(...)`
     - release client → `client.release()`

  2. **Shortcut**: `pool.query()`

  - Skips manual borrowing.
  - Automatically borrows a client, runs the query, and releases it.
  - **Best for simple, single queries.**

## Example Method 1: `pool.connect()` – Manual Borrow & Release

```javascript
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "password",
  port: 5432,
});

async function getUsers() {
  const client = await pool.connect(); // borrow client from pool
  try {
    const res = await client.query("SELECT id, name FROM users");
    console.log(res.rows); // Example: [ { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' } ]
  } finally {
    client.release(); // always release back to pool
  }
}

getUsers();
```

- You **hold onto a single client** with `pool.connect()`.
- You **must call** `.release()` so the pool can reuse it.

## Example Method 2: `pool.query()` – Direct use

```javascript
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "password",
  port: 5432,
});

async function getUsers() {
  const res = await pool.query("SELECT id, name FROM users"); // directly using pool
  console.log(res.rows); // Example: [ { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' } ]
}

getUsers();
```

- No need for `connect()` or `release()`.
- Pool handles it under the hood.
- Perfect for **most API endpoints** where you just run one query per request.

## When NOT to Use pool.query() Directly

- If you need to run **multiple queries in one session** (like transactions).
- Example: deduct money from account A, add to account B → needs **same connection** for both queries.
- In that case, you must `pool.connect()` manually, keep the connection, and then release it.

## Easy Way to Remember

1. **Single query?** Use `pool.query()`.
2. **Multiple related queries (transactions)?** Use `pool.connect()`.

> That’s how you use `pool.query()` directly — the simplest, most common way to interact with PostgreSQL in Node.js.
