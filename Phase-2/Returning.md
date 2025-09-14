# RETURNING

## Overview:

- Normally, when you run an `INSERT`, `UPDATE`, or `DELETE`, Postgres just tells you how many rows were affected.
- But sometimes you also want the actual data **back immediately** — like the new user you just inserted, or the updated row after an update.
- That's where `RETURNING` comes in.

## Example 1: Insert with RETURNING

- ```
  INSERT INTO users (name, age)
  VALUES ('Bob', 30)
  RETURNING *;
  ```

- This gives you the whole row:

  ```
  { id: 2, name: "Bob", age: 30 }
  ```

- In Node.js (`pg`):
  ```
  const result = await pool.query(
      "INSERT INTO users (name, age) VALUES ($1, $2) RETURNING *",
      ["Bob", 30]
  );
  console.log(result.rows[0]); // OUTPUT: { id: 2, name: "Bob", age: 30 }
  ```

## Example 2: Update with RETURNING

- ```
  UPDATE users
  SET age = 31
  WHERE name = 'Bob'
  RETURNING name, age;
  ```

- Postgres sends back only those columns you asked for.

  ```
  { name: "Bob", age: 31 }
  ```

- In Node:
  ```
  const result = await pool.query(
      "UPDATE users SET age = $1 WHERE name = $2 RETURNING name, age", // parameterized query
      [31, "Bob"]
  );
  console.log(result.rows[0]); // OUTPUT: { name: "Bob", age: 31 }
  ```

## Example 3: Delete with returning

- ```
  DELETE FROM users
  WHERE name = 'Bob'
  RETURNING *;
  ```

- You can get the deleted row back:

  ```
  { id: 2, name: 'Bob', age: 31 }
  ```

- You could now:

  1. Save this to a log table.

  - Let’s say you have this extra table:

    ```
    CREATE TABLE deleted_posts_log (
        id SERIAL PRIMARY KEY,
        post_id INT,
        title TEXT,
        content TEXT,
        deleted_at TIMESTAMP DEFAULT now()
    );
    ```

  - Now when deleting, you can capture and insert into logs:

    ```
    WITH deleted AS (
        DELETE FROM posts
        WHERE id = 2
        RETURNING *
    )
    INSERT INTO deleted_posts_log (post_id, title, content)
    SELECT id, title, content FROM deleted;
    ```

  - This removes the post and keeps a record in `deleted_posts_log`.

  2. Or temporarily store it so the user can hit Undo and re-insert it.

  - ```
      INSERT INTO posts (id, title, content)
      SELECT post_id, title, content
      FROM deleted_posts_log
      WHERE post_id = 2;
    ```

  - You might also delete it from the log table after restoring, depending on design.

- In code (Node.js example):

  ```
  // Delete and log
  const deletedPost = await pool.query(
      `DELETE FROM posts WHERE id = $1 RETURNING *`,
      [2]
  );

  // Save to log
  await pool.query(
      `INSERT INTO deleted_posts_log (post_id, title, content)
      VALUES ($1, $2, $3)`,
      [
          deletedPost.rows[0].id,
          deletedPost.rows[0].title,
          deletedPost.rows[0].content
      ]
  );

  // Later: Undo delete
  await pool.query(
      `INSERT INTO posts (id, title, content)
      VALUES ($1, $2, $3)`,
      [
          deletedPost.rows[0].id,
          deletedPost.rows[0].title,
          deletedPost.rows[0].content
      ]
  );
  ```

## Without and With `RETURNING`:

- Without `RETURNING`, you’d need to run two queries:

  1. Do the insert/update/delete
  2. Then select again

- But with `RETURNING`, you collapse it into **one atomic query** = faster + safer.
