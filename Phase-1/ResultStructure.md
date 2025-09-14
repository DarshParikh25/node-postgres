# STRUCTURE OF THE RESULT OBJECT:

- When you run:

  ```javascript
  const res = await client.query("SELECT NOW()");
  ```

- You get an object like:
  ```json
  {
    "command": "SELECT",
    "rowCount": 2,
    "oid": null,
    "rows": [ // Actual table records (rows)
        { "id": 1, "name": "Alice" },
        { "id": 2, "name": "Bob" }
    ],
    "fields": [ ... ]
  }
  ```

## PROPERTIES:

1. **res.rows**:

   - The actual data rows/records.
   - Always an array of objects.
   - Keys = column names, values = values from the table.
   - Example:
     ```javascript
     [{ id: 1, name: "Alice" }];
     ```

2. **res.rowCount**:

   - Number of rows returned or affected.
   - For `SELECT`, how many rows were returned.
   - For `UPDATE/DELETE`, how many rows were changed.
   - For `INSERT`, it’s `1` (unless bulk insert).

3. **res.command**:

   - The SQL command type executed.
   - Always a string like `"SELECT", "INSERT", "UPDATE", "DELETE"`.
   - Useful for debugging or logging.

4. **res.oid**:

   - Object ID (used in some Postgres internals).
   - Only meaningful in special cases (like inserting into a table with OIDs).
   - For most apps, this will just be `null`.

5. **res.fields**:
   - Metadata about the columns returned.
   - Each item has info like `name, dataTypeID`, etc.
   - Example:
     ```javascript
     [
       { name: "id", dataTypeID: 23 },
       { name: "name", dataTypeID: 25 },
     ];
     ```
