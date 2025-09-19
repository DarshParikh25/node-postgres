# Keep SQL Clean + Reusable

## Introduction

- When your project grows, queries often become:
  1. **Long & messy** → hard to read.
  2. **Duplicated in multiple places** → difficult to update.
  3. **Mixed into route logic** → confusing to maintain.

> The solution: **separate and structure your SQL queries so they are clean, reusable, and easy to maintain**.

## Best Practices

1. **Use Separate Query Functions**

- Instead of writing SQL inside routes, move them into **functions in db.js**.

  - Keeps routes focused on HTTP.
  - Makes queries reusable in multiple places.

- Example (db.js):

  ```js
  // db.js
  const getUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  };

  const updateUserEmail = async (id, newEmail) => {
    const result = await pool.query(
      "UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
      [newEmail, id]
    );
    return result.rows[0];
  };

  export { getUserByEmail, updateUserEmail };
  ```

- Now, in your route you just call:

  ```js
  import { getUserByEmail } "./db.js";

  app.get("/user/:email", async (req, res) => {
    const user = await getUserByEmail(req.params.email);
    res.json(user);
  });
  ```

2. **Use SQL Templates (Optional)**

- For very large queries, store them in **separate** `.sql` files and load them.
- This keeps JS files small and SQL readable.

- Example (`queries/users.sql`):

  ```sql
  -- Get users older than a given age
  SELECT * FROM users WHERE age > $1;
  ```

- Example (`db.js`):

  ```js
  import fs from "fs";
  import path from "path";

  const getUsersByAgeQuery = fs.readFileSync(
    path.join(__dirname, "queries", "users.sql"),
    "utf-8"
  );

  const getUsersByAge = async (age) => {
    const result = await pool.query(getUsersByAgeQuery, [age]);
    return result.rows;
  };

  export { getUsersByAge };
  ```

3. **Use Consistent Naming**

- Function names should describe what they do (`getUserById`, `createUser`, `deleteUser`).
- Keep naming consistent so your teammates (or future you!) know what’s going on.

4. **Avoid Hardcoding Table Names/Columns**

- Use constants if table names or common column lists repeat.

  ```js
  const USER_COLUMNS = "id, name, email, age";

  async function getUsers() {
    return (await pool.query(`SELECT ${USER_COLUMNS} FROM users`)).rows;
  }
  ```

## Benefits of Clean SQL

1. **Readability** → You instantly know what a function does.
2. **Reusability** → One function can serve multiple routes.
3. **Maintainability** → Change SQL in one place, not everywhere.
4. **Scalability** → Easier to expand when project grows.
