# COMMIT and ROLLBACK

## Syntax Recap (SQL):

```sql
BEGIN;
-- queries here
COMMIT;   -- save changes if all queries succeed
ROLLBACK; -- undo everything if something fails
```

## Decide the Outcome:

- If everything went fine → `COMMIT` → apply changes permanently.
- If something failed (error, bad query, constraint violation, etc.) → `ROLLBACK` → undo _all_ changes since `BEGIN`.

## Example Flow (Success Case):

```javascript
await client.query("BEGIN"); // Start sandbox

await client.query("INSERT INTO users (name, age) VALUES ($1, $2)", [
  "Alisha",
  25,
]);
// user Alice is added (but not permanent yet)

await client.query("INSERT INTO logs (message) VALUES ($1)", [
  "Created Alisha",
]);
// log is added (also tentative)

await client.query("COMMIT"); // Both user + log are now PERMANENT
```

- Flow explanation:
  1. Transaction begins.
  2. Both queries succeed.
  3. `COMMIT` → changes become permanent.
  4. Other clients can now see Alisha + log row.

## Example Flow (Failure Case):

```javascript
await client.query("BEGIN"); // Start sandbox

await client.query("INSERT INTO users (name, age) VALUES ($1, $2)", [
  "Bob",
  30,
]);
// Bob is added (tentatively)

await client.query("INSERT INTO logs (msg) VALUES ($1)", ["Created Bob"]);
// ERROR: column "msg" does not exist

await client.query("ROLLBACK"); // Bob’s insert is UNDONE
```

- Flow explanation:
  1. Transaction begins.
  2. First insert works (but not visible to others yet).
  3. Second insert fails (typo in column).
  4. Postgres rolls back everything to the state before `BEGIN`.
  5. Result: **Bob never existed**.

## Node.js (pg) Example:

```javascript
import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "testdb",
  password: "your_password",
  port: 5432,
});

const runTransaction = async () => {
  try {
    await client.connect();

    // start transaction
    await client.query("BEGIN");

    // first query
    await client.query("INSERT INTO users (name, age) VALUES ($1, $2)", [
      "Alisha",
      25,
    ]);

    // second query
    await client.query("INSERT INTO logs (message) VALUES ($1)", [
      "Created new user Alisha",
    ]);

    // everything went fine → commit
    await client.query("COMMIT");
    console.log("Transaction committed");
  } catch (err) {
    // something failed → rollback
    await client.query("ROLLBACK");
    console.error("Transaction rolled back", err.message);
  } finally {
    await client.end();
  }
};

runTransaction();
```
