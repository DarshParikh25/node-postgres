# Separate DB Connection Logic into db.js

## Introduction:

- In small test scripts, we often set up the PostgreSQL client or pool directly inside the same file where we write queries.
- But in **real projects**, this creates duplication and makes the code messy.

- A better approach is to keep all **database connection setup** in a **single file** (`db.js`) and then **reuse** it across the app.

## Why do this?

1. **Centralized setup** → Only one place to manage host, user, password, etc.
2. **Easy maintenance** → If you change a setting (like DB host), you do it in one place.
3. **Cleaner code** → Other files don’t care about how the DB is connected, they just use the pool.
4. **Reusable & Scalable** → Works well in both small apps and large enterprise projects.

## Example: `db.js`:

```javascript
// db.js
import { Pool } from "pg";

// Create a connection pool
const pool = new Pool({
  user: "your_db_user",
  host: "localhost",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432, // default PostgreSQL port
});

// Export the pool for reuse
export default pool;
```

## How to Use in Other Files?

- Let’s say you have a file `app.js` where you need to run queries.

  ```javascript
  // app.js
  import pool from "./db.js";

  async function testQuery() {
    try {
      const res = await pool.query("SELECT NOW()");
      console.log("Current Time:", res.rows[0]);
    } catch (err) {
      console.error("Query Error:", err);
    }
  }

  testQuery();
  ```

## Flow Explanation

1. `db.js` creates and exports the **connection pool**.
2. Any file (like `app.js`, `routes.js`, etc.) imports it.
3. Every query in your app now goes through the **same pool**.
   - Efficient connection management.
   - No duplicate connection setup code.
