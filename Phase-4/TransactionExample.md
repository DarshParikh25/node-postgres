# Classic Example: Money Transfer with Transactions

- This is the **poster child use-case** for transactions.
- Imagine two users, Peter and Kim. Peter wants to send Kim $1000.

## 1. Without Transaction:

```javascript
// deduct from Peter
await client.query("UPDATE accounts SET balance = balance - 1000 WHERE id = 1");

// Something goes wrong here (network, crash, bad SQL), so following queries will not run!

// add to Kim
await client.query("UPDATE accounts SET balance = balance + 1000 WHERE id = 2");
```

- **Problem**: Peter lost $1000, but Kim didn’t get it.
- This is called **inconsistent state**.

## 2. With a Transaction:

```javascript
import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "bank_db",
  password: "your_password",
  port: 5432,
});

const transferMoney = async (fromId, toId, amount) => {
  try {
    await client.connect();
    await client.query("BEGIN"); // start transaction

    // deduct from Peter
    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromId]
    );

    // add to Kim
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toId]
    );

    await client.query("COMMIT"); // finalize both
    console.log("Transfer successful");
  } catch (err) {
    await client.query("ROLLBACK"); // undo everything
    console.error("Transfer failed, rolled back:", err.message);
  } finally {
    await client.end();
  }
};

transferMoney(1, 2, 1000);
```

- FLow explanation:
  1. `BEGIN` → start sandbox.
  2. Deduct $1000 from Peter (still tentative).
  3. Add $1000 to Kim (still tentative).
  4. If both succeed → `COMMIT`.
  - Peter has $1000 less.
  - Kim has $1000 more.
  5. If any query fails → `ROLLBACK`.
  - Both accounts remain untouched.

### This is the **real-world power** of transactions:

- No double spending
- No missing money
- Database always stays consistent
