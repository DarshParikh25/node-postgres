# What is Connection Pooling?

- When your Node.js app talks to PostgreSQL, it needs to **open a connection**.

  - Opening and closing a new connection for every request is slow and resource-heavy.
  - Imagine a web server getting 1,000 API requests per second — opening 1,000 separate connections would crash the database.

- **Connection pooling** solves this:

  - Instead of creating a brand-new connection every time, it keeps a “pool” (like a bucket) of ready-to-use connections.
  - When your app needs to query, it borrows a connection from the pool.
  - When done, the connection is **released back** to the pool for reuse.

- This makes your API:
  1. Faster (no time wasted in re-connecting)
  2. Scalable (can handle many users at once)
  3. Reliable (avoids exhausting database resources)
