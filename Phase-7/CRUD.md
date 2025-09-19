# CRUD Endpoints (/users)

## Users CRUD

1. Create User (POST /users)

   - SQL:

     ```sql
     INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;
     ```

   - Express.js Example:
     ```js
     app.post("/users", async (req, res) => {
       const { name, email } = req.body;
       try {
         const result = await pool.query(
           "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
           [name, email]
         );
         res.json(result.rows[0]);
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });
     ```

2. Get All Users (GET /users)

   - SQL:

     ```sql
     SELECT * FROM users;
     ```

   - Express.js Example:
     ```js
     app.get("/users", async (req, res) => {
       try {
         const result = await pool.query("SELECT * FROM users");
         res.json(result.rows);
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });
     ```

3. Update User (PUT /users/:id)

   - SQL:

     ```sql
     UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *;
     ```

   - Express.js Example:
     ```js
     app.put("/users/:id", async (req, res) => {
       const { id } = req.params;
       const { name, email } = req.body;
       try {
         const result = await pool.query(
           "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
           [name, email, id]
         );
         res.json(result.rows[0]);
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });
     ```
