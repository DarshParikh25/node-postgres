# CLIENT VS POOL

## CLIENT

- Single dedicated connection.
- Good for scripts and one-off tasks:
  1. `connect()`
  2. run queries
  3. `end()`
- Code using client:

  ```javascript
  import { Client } from pg;

  const client = new Client({...});
  await client.connect();
  const res = client.query(...);
  await client.end();
  ```

## POOL

- Manages many clients.
- Instead of opening/closing for each request, you grab one from the pool - faster and scalable for APIs.
- Code using pool:

  ```javascript
  import { Pool } from pg;

  const pool = new Pool({...});
  const res = await pool.query(...);
  ```

> **Notice**: with Pool, we didn’t need to manually connect/disconnect each time — pool handles it.
