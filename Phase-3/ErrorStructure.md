# ERROR OBJECT STRUCTURE

## Unique Constraint Violation Example:

- Table:

  ```
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE
  );
  ```

- Node.js code:
  ```
  try {
      await pool.query("INSERT INTO users (email) VALUES ($1)", ["alice@example.com"]);
      await pool.query("INSERT INTO users (email) VALUES ($1)", ["alice@example.com"]); // duplicate
  } catch (err) {
      console.log(err);            // error object {...}
      console.log(err.message);    // duplicate key value violates unique constraint 'users_email_key'
      console.log(err.code);       // 23505
      console.log(err.constraint); // users_email_key
  }
  ```

## Error Object (Simplified):

- Here’s how the object might look when printed:
  ```
  {
      "length": 211,
      "name": "error",
      "code": "23505",
      "detail": "Key (email)=(alice@example.com) already exists.",
      "table": "users",
      "constraint": "users_email_key",
      "hint": undefined,
      "position": undefined,
      "message": "duplicate key value violates unique constraint 'users_email_key'"
      ... // Other properties
  }
  ```

> **Security tip**:
> Do **not** send raw `err.message` to clients in production; always log it server-side.

## Important Properties:

1. `err.message` - Human-readable message describing the error
2. `err.code` - Postgres SQLSTATE code (e.g., `23505` = unique violation)
3. `err.detail` - Extra details about the error, like which value caused it
4. `err.hint` - Optional hint from Postgres suggesting how to fix it
5. `err.position` - Character position in SQL where error occurred
6. `err.table` - Table involved in the error (if applicable)
7. `err.constraint` - Constraint that was violated (if applicable)

- From this, we can see **exactly why the query failed**.

## Why this is important?

- **Debugging**: You can see exactly why a query failed.
- **Safe Responses**: Map codes (23505, 23503) to user-friendly HTTP responses.
- **Logging**: Save the full object server-side for auditing or monitoring.
- **Prevention**: You can validate input or handle duplicates before they throw errors.
