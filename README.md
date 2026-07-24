# Notes Fullstack

<details>
  <summary>Schema Explanation</summary>

![Schema](./public/demo/schema.png)

### 1. `User` Entity (`users`)

- **Core Identity**: Acts as the primary account holder, uniquely identified by an auto-incrementing integer `id` and a unique `email` address with a secure `passwordHash`.

- **Lifecycle Tracking**: Tracks account creation, automatic updates on modification (`updatedAt`), and soft-deletion capability via `deletedAt`.

- **Ownership & Relations**:
  - Owns zero or more `Note` records.
  - Owns zero or more `Folder` records.

- **Cascade Behavior**: If a `User` account is deleted, the database automatically cascades deletion to wipe out all associated `Folder` and `Note` rows.

### 2. `Folder` Entity (`folders`)

- **Core Identity**: Represents a user-defined category or container to group notes, identified by an auto-incrementing `id` and a custom `name`.

- **Composite Ownership Constraint**: Establishes a composite unique key across `[id, userId]`. This advanced design choice allows a `Folder` to securely reference a composite foreign key constraint from notes, ensuring a note can only ever be placed inside a folder that belongs to the exact same user.

- **Performance Indexing**: Maintains an explicit index on `userId` to optimize queries fetching all folders belonging to a specific user.

- **Lifecycle Tracking**: Tracks creation timestamp, automatic modification timestamps, and soft-deletes via `deletedAt`.

- **Relations & Cascade Rules**:
  - Belongs to a single `User` (`onDelete: Cascade` — if the user goes, the folder goes).
  - Contains zero or many `Note` records.

### 3. `Note` Entity (`notes`)

- **Core Identity**: Represents an individual user note containing a `title`, text `content`, and tracking timestamps (`createdAt`, `updatedAt`, and soft-delete `deletedAt`).

- **Optional Organization**: Can exist independently or reside within a specific `Folder` via an optional `folderId`.

- **Performance Indexing**: Features individual indexes on both `userId` and `folderId` to accelerate lookups when filtering notes by owner or folder context.

- **Relations & Safeguards**:
  - Belongs to a single `User` (`onDelete: Cascade`).
  - Optionally links to a `Folder` using a composite relation (`[folderId, userId]` references `[id, userId]`). If the parent folder is deleted, the relation safely unlinks the note (`onDelete: SetNull`) instead of deleting the note itself.

</details>
