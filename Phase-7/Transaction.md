# Transaction: Creating User with a Welcome Task

## Why Do We Need a Transaction Here?

- When creating a new user, we also want to **automatically create a “Welcome Task”** for them.
  - If **user creation succeeds** but **task creation fails** → inconsistent data (user exists, but no task).
  - If **task creation succeeds** but **user creation fails** → orphaned task.

> **Transactions** ensure both operations succeed together or fail together.

## Transaction Flow:

1. Start a transaction → `BEGIN`.
2. Insert a new user → `INSERT INTO users`.
3. Insert a welcome task → `INSERT INTO tasks`.
4. If both succeed → `COMMIT`.
5. If any fail → `ROLLBACK`.

## Example Implementation (Express.js + pg Pool)

```js
app.post("/users-with-task", async (req, res) => {
  const client = await pool.connect(); // get client from pool
  try {
    await client.query("BEGIN"); // start transaction

    // Step 1: Create user
    const userResult = await client.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [req.body.name, req.body.email]
    );
    const newUser = userResult.rows[0];

    // Step 2: Create welcome task for this user
    const taskResult = await client.query(
      "INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *",
      [newUser.id, "Welcome to the app!"]
    );
    const welcomeTask = taskResult.rows[0];

    await client.query("COMMIT"); // commit if all good

    res.status(201).json({
      user: newUser,
      welcomeTask,
    });
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on failure
    res.status(500).json({ error: err.message });
  } finally {
    client.release(); // release connection back to pool
  }
});
```

## Test Cases to Try:

1. **Happy Path**: Create user `Ketan → task created automatically`.
2. **Force Error**: Insert a duplicate email (unique constraint) → rollback both user + task.
3. **DB Crash Simulation**: Kill transaction in the middle → rollback ensures no partial data.

### Key Takeaways:

1. Transactions ensure **data consistency**.
2. Always use `try/catch` with `ROLLBACK` in case of failure.
3. `client.release()` is crucial, or you’ll leak connections in the pool.
4. This pattern is common in **financial apps, e-commerce orders, task apps** etc.
