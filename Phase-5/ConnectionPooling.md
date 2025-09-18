# Why Pooling Matters in APIs?

## The Problem Without Pooling

- Every time a request hits your API, your server needs a database connection.
- If you **create a new client for each request** (`new Client()`):
  - It opens a new TCP connection to PostgreSQL.
  - Handshakes, authentication, setup… all repeated again and again.
  - Takes time (slow response).
  - Eats up database resources.

> Imagine 1,000 users hitting your API → 1,000 new connections → database **overloaded**.

## The Solution: Pooling

- A **connection pool** is a “bucket” of live database connections, created once and reused.

  - **Step 1**: Pool is created (e.g., 10 connections).
  - **Step 2**: When a request comes in, it **borrows** one connection.
  - **Step 3**: Query runs.
  - **Step 4**: Connection is released back into the pool for the next request.

- This way:
  - No overhead of creating/destroying connections repeatedly.
  - Your DB only manages a limited number of active connections (controlled by pool size).
  - More stable under heavy load.

## Example: Without Pool vs With Pool

### Without Pool (using `Client` every time):

```javascript
import { Client } from "pg";

async function getUsers() {
  const client = new Client();
  await client.connect(); // creates new connection EVERY TIME
  const res = await client.query("SELECT * FROM users");
  await client.end(); // closes it
  return res.rows;
}
```

- Creates and closes a new connection each time.
- Slower and wasteful.

### With Pool (reusing connections):

```javascript
import { Pool } from "pg";

const pool = new Pool({ max: 10 }); // max 10 connections

async function getUsers() {
  const res = await pool.query("SELECT * FROM users"); // borrows from pool
  return res.rows; // connection automatically returned to pool
}
```

- Reuses up to 10 open connections.
- Faster response, more efficient.
- Perfect for APIs handling many requests.

## Easy Way to Remember

- Think of a restaurant:
  - Without pooling → every customer brings their own chair & table → chaos.
  - With pooling → restaurant already has a fixed number of tables/chairs, customers just sit, eat, and leave → smooth.

> That’s why **pooling matters** in APIs: it makes them **scalable**, **fast**, and **resource-efficient**.
