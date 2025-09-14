# ERROR HANDLING IN node-postgres

- Whenever an error occurs in `pg`, it returns an error object (`err`) instead of crashing your application.
- This object contains detailed information about **what went wrong**, which is extremely useful for debugging and for sending safe messages to the client.
