# Structure Code in Node.js + pg

- **Code structuring** is about organizing database-related code in a **modular and reusable way**, so that:
  - Database logic is **isolated** from route handlers.
  - Queries are **centralized** and easy to reuse.
  - The codebase becomes **clean, testable, and scalable**.

## Why Structuring Is Important?

- **Maintainability** → Large projects can have dozens of queries; keeping them scattered leads to duplication and bugs.
- **Reusability** → A `getUserById()` function can be used by multiple routes.
- **Team Collaboration** → Clear boundaries make it easier for multiple developers to work together.
- **Performance & Debugging** → Structured code makes it easier to log, monitor, and optimize queries.
