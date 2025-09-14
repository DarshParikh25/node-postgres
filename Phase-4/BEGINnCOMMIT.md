## TRANSACTION FLOW (SUCCESS PATH):

1. **BEGIN** → tells PostgreSQL: _“Start a transaction block.”_
2. Run **one or more queries** → all changes are pending, not visible to others yet.
3. **COMMIT** → saves the pending changes permanently.

## SQL Example:

```sql
BEGIN;

INSERT INTO orders (product_id, quantity) VALUES (1, 2);
UPDATE inventory SET stock = stock - 2 WHERE product_id = 1;

COMMIT; -- if everything is successful
```

- Until `COMMIT`, none of the changes are finalized.
- After `COMMIT`, both the `INSERT` and `UPDATE` are locked in.

## Node.js Example with `pg`:

```javascript
import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "mypassword",
  port: 5432,
});

const placeOrder = async (productId, quantity) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    await client.query(
      "INSERT INTO orders (product_id, quantity) VALUES ($1, $2)",
      [productId, quantity]
    );

    await client.query(
      "UPDATE inventory SET stock = stock - $1 WHERE product_id = $2",
      [quantity, productId]
    );

    await client.query("COMMIT"); // Finalize transaction
    console.log("Order placed successfully");
  } finally {
    client.release(); // Release back to pool
  }
};

placeOrder(1, 2);
```

## Key Takeaways:

1. Use `BEGIN` before grouped queries.
2. Use `COMMIT` to finalize the grouped work.
3. Without `COMMIT`, changes won’t persist.
