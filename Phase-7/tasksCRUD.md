# CRUD Endpoints (/tasks)

## Tasks CRUD

1. Create Task (POST /tasks)

   - SQL:

     ```sql
     INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *;
     ```

   - Express Example:
     ```js
     app.post("/tasks", async (req, res) => {
       const { user_id, title } = req.body;
       try {
         const result = await pool.query(
           "INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *",
           [user_id, title]
         );
         res.json(result.rows[0]);
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });
     ```

2. Get All Tasks (GET /tasks)

   - SQL:

     ```sql
     SELECT * FROM tasks;
     ```

   - Express Example:
     ```js
     app.get("/tasks", async (req, res) => {
       try {
         const result = await pool.query("SELECT * FROM tasks");
         res.json(result.rows);
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });
     ```

3. Update Task (PUT /tasks/:id)

   - SQL:

     ```sql
     UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *;
     ```

   - Express Example:
     ```js
     app.put("/tasks/:id", async (req, res) => {
       const { id } = req.params;
       const { title, completed } = req.body;
       try {
         const result = await pool.query(
           "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
           [title, completed, id]
         );
         res.json(result.rows[0]);
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });
     ```

4. Delete Task (DELETE /tasks/:id)

   - SQL:

     ```sql
     DELETE FROM tasks WHERE id = $1 RETURNING *;
     ```

   - Express Example:
     ```js
     app.delete("/tasks/:id", async (req, res) => {
       const { id } = req.params;
       try {
         const result = await pool.query(
           "DELETE FROM tasks WHERE id = $1 RETURNING *",
           [id]
         );
         res.json(result.rows[0]);
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });
     ```

## Key Points to Notice:

1. **Parameterized queries** (`$1, $2`) → protect against SQL injection.
2. **RETURNING \*** → always return the affected row(s).
3. **Error handling** is essential in production.
4. **User-task relationship** ensures each task belongs to a valid user.
