# Properly Release & Close Connections in `pg`

- When working with PostgreSQL in Node.js using the `pg` library, handling connections correctly is **critical** for performance and stability.

## Releasing Individual Connections

- When you use `pool.connect()`, you are **borrowing a client** from the pool.

  - After using it, you **must call** `client.release()`.
  - If you forget, the pool will eventually run out of clients → your app will hang or crash.

- Example:

  ```javascript
  import { Pool } from "pg";

  const pool = new Pool({
    /* config */
  });

  async function fetchUsers() {
    const client = await pool.connect(); // borrow client
    try {
      const res = await client.query("SELECT * FROM users");
      console.log(res.rows);
    } finally {
      client.release(); // return to pool
    }
  }
  ```

> `finally` ensures release happens **even if an error occurs**.

## Closing the Entire Pool

- Sometimes, your app may need to **shut down gracefully** (e.g., on server stop).

  - In that case, you should **close the whole pool** to release all DB connections.
  - Use `pool.end()` for this.

- Example:

```javascript
import { Pool } from "pg";

const pool = new Pool({
  /* config */
});

async function fetchUsers() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM users");
    console.log(res.rows);
  } finally {
    client.release();
  }
}

async function shutdown() {
  console.log("Closing pool...");
  await pool.end();
}

// Run and then close
fetchUsers().then(shutdown);
```

> This prevents “zombie” connections staying open after the app exits.

## Best practices

1. Use `pool.query()` when possible → no manual release needed.
2. If you use `pool.connect()`, **always call** `release()` in `finally`.
3. Call `pool.end()` only when your entire app shuts down.
4. Never leave connections open — this can overload Postgres.

## Quick Recap:

- `client.release()` → give a single borrowed client back.
- `pool.end()` → close everything down.
