# Database Schema Design

## Overview

- This project involves two main entities:

  1. **Users** → people using the system.
  2. **Tasks** → actions or to-do items assigned to a user.

- This is a classic one-to-many relationship:
  1. A **user** can have **many tasks**.
  2. Each **task** belongs to exactly **one user**.

## Tables

1.  **users table**: Holds information about each user.

    | **Column** | **Type**     | **Constraints**           | **Notes**              |
    | ---------- | ------------ | ------------------------- | ---------------------- |
    | id         | SERIAL       | PRIMARY KEY               | Auto-increment user ID |
    | name       | VARCHAR(100) | NOT NULL                  | User’s full name       |
    | email      | VARCHAR(150) | UNIQUE NOT NULL           | Must be unique         |
    | created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP | When user was created  |

2.  **tasks table**: Holds tasks assigned to users.

    | **Column** | **Type**     | **Constraints**                           | **Notes**                           |
    | ---------- | ------------ | ----------------------------------------- | ----------------------------------- |
    | id         | SERIAL       | PRIMARY KEY                               | Auto-increment task ID              |
    | user_id    | INT          | FOREIGN KEY → users(id) ON DELETE CASCADE | Links to the user who owns the task |
    | title      | VARCHAR(200) | NOT NULL                                  | Short description of the task       |
    | completed  | BOOLEAN      | DEFAULT FALSE                             | Task status                         |
    | created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                 | When task was created               |

## Relationships

- `users.id` → `tasks.user_id`
- One-to-many: **1 user** : **N tasks**
- `ON DELETE CASCADE` ensures: if a user is deleted, all their tasks are also deleted.

## SQL Script

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Why this schema?

1. **Simple & realistic**: Most apps have users + items (like posts, tasks, orders).
2. **Normalized**: No duplication — tasks store `user_id` instead of full user info.
3. **Scalable**: Easy to add features later (like task deadlines, user roles).

> With schema ready, next step is to design **CRUD Endpoints** for `users` first.
