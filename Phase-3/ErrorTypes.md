# CONNECTION ERRORS vs QUERY ERRORS

- When using pg, errors usually fall into two broad categories:

  1. Connection Errors
  2. Query Errors

- Imagine Postgres is like a library.
  - A **connection error** is when you **can’t even enter the library** (wrong key, library closed, network issue).
  - A **query error** is when you **get inside fine, but ask the librarian for a book that doesn’t exist, or break a rule**.

## 1. CONNECTION ERRORS:

- **Stage**: Before you can even run SQL.

- **Example causes**:

  1. Wrong host, port, user, or password in your `.env`
  2. Database server is down or unreachable
  3. Network issues (firewall blocking, Docker container not running)

- **Effect**: No queries can be run at all.

- **Error Code Examples**:

  1. `28P01` → wrong password
  2. `ECONNREFUSED` → server not reachable
  3. `3D000` → database does not exist

- **Analogy**: you’re **locked out of the library**.

- **Error object (sample)**:
  ```
  {
      "name": "error",
      "length": 111,
      "severity": "FATAL",
      "code": "28P01",
      "message": "password authentication failed for user 'wronguser'",
      "detail": null,
      "hint": null,
      "position": null,
      "routine": "auth_failed"
  }
  ```

> Notice the code `28P01` = authentication failure.

## 2. QUERY ERRORS:

- **Stage**: After a successful connection.

- **Example causes**:

  1. Table/column doesn’t exist
  2. Syntax error in query
  3. Violating unique/foreign key constraints
  4. Wrong data type inserted

- **Effect**: Connection works, but only that specific query fails.

- **Error Code Examples**:

  1. `42P01` → table does not exist
  2. `23505` → unique constraint violation (duplicate key)
  3. `42601` → syntax error

- **Analogy**: you got inside the library, but you:

  - asked for a book that doesn’t exist, or
  - tried to borrow more than allowed, or
  - filled the form wrong.

- **Error object (sample)**:

  ```
  {
      "name": "error",
      "length": 92,
      "severity": "ERROR",
      "code": "42P01",
      "message": "relation \"userss\" does not exist",
      "position": "13",
      "routine": "errorMissingRTE"
  }
  ```

> Notice `42P01` = undefined table.

## Handling them differently:

- In Node.js, you might want to **separate logic**:
  ```
  try {
      const res = await pool.query("SELECT * FROM userss"); // typo
      console.log(res.rows);
  } catch (err) {
      if (err.code === "28P01") {
          console.error("Connection/authentication issue!");
      } else if (err.code === "42P01") {
          console.error("Query issue: table does not exist!");
      } else {
          console.error("Unexpected error:", err);
      }
  }
  ```

## Rule of Thumb:

1. - **Connection errors** = **outside problem** → credentials, host, network, DB not running.
   - If you **can’t reach the DB at all** → connection error.

2. - **Query errors** = **inside problem** → your SQL logic is wrong.
   - If you **can reach DB but SQL fails** → query error.
