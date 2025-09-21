# Node.js(Express.js) + PostgreSQL

## Roadmap : node-postgres:

### Phase 1: Setup & Basics

    1. Install pg and connect to your Postgres DB
    2. Learn difference between Client vs Pool
    3. Make your first query (SELECT NOW())
    4. Understand how query results come back (res.rows)

### Phase 2: Running Queries

    1. Basic SELECT, INSERT, UPDATE, DELETE from Node
    2. Parameterized queries ($1, $2) → prevent SQL injection
    3. Returning inserted/updated data with RETURNING *

### Phase 3: Error Handling

    1. Error object structure
    2. Handle invalid queries gracefully (try/catch, err object)
    3. Differentiate between connection errors vs query errors

### Phase 4: Transactions

    1. Start a transaction with BEGIN
    2. Use COMMIT and ROLLBACK for success/failure
    3. Example: deduct money from one account and add to another if fails, rollback(nobody losses money)

### Phase 5: Connection Pooling

    1. Why pooling matters in APIs (better performance, reuse connections)
    2. Use Pool.query directly
    3. Properly release/close connections

### Phase 6: Structuring Code

    1. Separate DB connection logic into its own file (db.js)
    2. Export query functions (getUsers, createUser)
    3. Import them into routes (Express, Fastify, etc.)
    4. Keep SQL clean + reusable

### Phase 7: Project Practice Pick a mini project that uses everything above:

    1. Example: Users + Tasks API
        1. Database Schema Design
        2. CRUD endpoints (/users) _DONE
        3. CRUD endpoints(/tasks)
        4. A transaction (when creating user → add a “welcome task”)
        5. Pooling enabled for better performance

### Phase 8: Others (Optional for later - Advance)

    1. Streaming results (client.query with row events)
    2. Prepared statements for high-frequency queries
    3. Custom type parsers (for special Postgres types)

## Time-Efficient Learning Plan

1. **Day 1–2:** Setup, Client vs Pool, simple queries
2. **Day 3–4:** Param queries, error handling, transactions
3. **Day 5–6:** Connection pooling + code structure
4. **Day 7:** Build the mini project
