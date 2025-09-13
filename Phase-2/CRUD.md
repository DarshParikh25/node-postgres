# HOW CRUD WORKS IN node-postgres?

## RUNNING QUERIES FROM POSTGRESQL:

- Let’s assume this table exists in your database:

  ```
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      age INT
  );

  SELECT * FROM users;

  INSERT INTO users
  (name, age)
  VALUES
  ('Alice', 25);

  UPDATE users
  SET age = 26
  WHERE name = 'Alice';

  DELETE FROM users
  WHERE name = 'Alice';
  ```

## RUNNING QUERIES FROM NODE.JS:

1. **Setup**:

   ```
   import pkg from 'pg';
   const { Pool } = pkg;

   const pool = new Pool({
       user: process.env.DB_USER,
       host: process.env.DB_HOST,
       database: process.env.DB_NAME,
       password: process.env.DB_PASSWORD,
       port: process.env.DB_PORT,
   });
   ```

2. **SELECT (Read Data)**:

   ```
   const res = await pool.query('SELECT * FROM users');
   console.log(res.rows);
   ```

   - Example output:

     ```
     [
         { id: 1, name: 'Alice', age: 25 },
         { id: 2, name: 'Bob', age: 30 }
     ]
     ```

3. **INSERT (Create new row)**:

   ```
   await pool.query("INSERT INTO users (name, age) VALUES ('Alice', 25)");
   ```

   - Adds a new row into the table.
   - No result rows are returned unless you add `RETURNING *`.

4. **UPDATE (Modify existing row)**:

   ```
   await pool.query("UPDATE users SET age = 26 WHERE name = 'Alice'");
   ```

   - Finds rows with `name = 'Alice'` and updates their age.
   - No rows are returned unless you use `RETURNING *`.

5. **DELETE (Remove row)**:

   ```
   await pool.query("DELETE FROM users WHERE name = 'Alice'");
   ```

   - Removes rows from the table matching the condition.
   - Without `WHERE`, it would delete all rows (dangerous!).
