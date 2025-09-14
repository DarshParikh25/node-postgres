# WHAT IS TRANSACTION?

- A transaction is a sequence of one or more SQL statements executed as a single unit of work.
  - Either **all statements succeed** → changes are saved with `COMMIT`.
  - Or **any statement fails** → changes are undone with `ROLLBACK`.

## WHY TRANSACTIONS MATTERS?

- Prevent **partial updates** (avoid corruption if an error occurs mid-operation).
- Guarantee **consistency** across multiple related operations.
- Common use cases:
  1. Bank transfers
  2. Inventory updates
  3. Multi-step form submissions
