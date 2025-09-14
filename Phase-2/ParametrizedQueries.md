# PARAMETERIZED QUERIES in node-postgres

## 1. Why Parameterized Query?

- If you directly inject variables into SQL, like this:
  ```
  const email = req.body.email; // user input
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  await pool.query(query);
  ```

> **DANGER**:
> This is vulnerable to **SQL Injection**.

- Example of **SQL Injection**:

  - Now, imagine a malicious user submits this as the email input:
    ```
    ' OR 1=1; --
    ```
    - The resulting query becomes:
      ```
      SELECT * FROM users WHERE email = '' OR 1=1; --';
      ```
      - `OR 1=1` → always true → returns all rows.
      - `--` → turns the rest into a comment.
      - In some cases, attackers can even append extra statements (`DROP TABLE users;`).
  - That's **SQL Injection**.

## 2. The Safe Way → Parameterized Queries (How Parameterized Queries Solve This)

- Now, with parameterized queries:

  ```
  const email = req.params.email; // user input
  const res = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
  );
  ```

  - Explanation:

    1. `$1` → placeholder (first variable)
    2. `[userId]` → array of values, safely substituted by the driver
    3. The pg client ensures the value is escaped properly (no injection possible).

- If the user submits `"' OR 1=1; --"`, Postgres does not treat it as part of SQL.
- Instead, it treats it as a plain string value:

  ```
  SELECT * FROM users WHERE email = ''' OR 1=1; --';
  ```

  - This just looks for an email literally equal to `"' OR 1=1; --"`.

- No injection is possible.

## 3. Multiple Parameters

- ```
  const res = await pool.query(
    "SELECT * FROM users WHERE name = $1 AND age = $2",
    ['Alice', 25]
  );
  ```
  - `$1` → 'Alice'
  - `$2` → 25

## 4. Works with INSERT, UPDATE, DELETE too

1.  INSERT:

    ```
    await pool.query(
        "INSERT INTO users (name, age) VALUES ($1, $2)",
        ['Charlie', 23]
    );
    ```

2.  UPDATE:

    ```
    await pool.query(
        "UPDATE users SET age = $1 WHERE name = $2",
        [24, 'Charlie']
    );
    ```

3.  DELETE:

    ```
    await pool.query(
        "DELETE FROM users WHERE name = $1",
        ['Charlie']
    );
    ```

## 5. Key Benefits

1. **Security** → prevents SQL injection
2. **Performance** → database can reuse execution plans for the same query with different parameters
3. **Clarity** → separates SQL from data values
