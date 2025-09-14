# HANDLE INVALID QUERIES GRACEFULLY

- When writing queries in Node.js (`pg`), **invalid SQL, wrong params, or constraint violations** will throw errors.
- We need to catch them so that:
  1. The app doesn’t crash.
  2. We can respond to the frontend properly.
  3. We can log meaningful details for debugging.

## Example: try/catch

```javascript
import { pool } from "./db.js";

async function safeQuery() {
  try {
    const result = await pool.query("SELECT * FROM non_existing_table");
    console.log(result.rows);
  } catch (err) {
    console.error("Database error:", err.message);
    // maybe send a response in an API:
    // res.status(500).json({ error: "Something went wrong!" });
  }
}

safeQuery();
```

- If the query is fine → prints rows.
- If the query is invalid → error is caught, app keeps running.

## Adding Error Details for Debugging:

```javascript
try {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [999]);
  console.log(result.rows);
} catch (err) {
  console.error({
    message: err.message, // human-readable
    code: err.code, // Postgres error code
    detail: err.detail, // extra info (if available)
  });
}
```

## Best Practice in an API Context:

- When you’re writing an Express route:

  ```javascript
  import express from "express";
  import { pool } from "./db.js"; // your pg pool setup

  const app = express();
  app.use(express.json());

  app.post("/users", async (req, res) => {
    try {
      const { name, email } = req.body;
      const result = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        [name, email]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("DB error:", err);

      // Specific handling by error code
      if (err.code === "23505") {
        return res.status(409).json({ error: "Email already exists" });
      }
      if (err.code === "23503") {
        return res.status(400).json({ error: "Invalid foreign key reference" });
      }

      // Generic fallback
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.listen(5000);
  ```

- Invalid query → 500 response, app still runs.
- Specific error code handling → `23505`: 409 response and `23503`: 400 response
- User not found → 404 response.
- Good query → returns user.
