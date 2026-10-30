---
name: Startup database safety
description: Prevent data loss from app initialization and legacy database maintenance scripts.
---

Never run `DROP TABLE`, `DROP COLUMN`, or `TRUNCATE` from startup seeding. Startup code repeats on every server launch; schema/data removal belongs only in an explicitly reviewed migration with a verified backup. Keep legacy destructive maintenance scripts disabled or behind a clear opt-in, and never point them at another database without the user's authorization.

**Why:** A startup seed contained table and column deletion statements, and a legacy Supabase migration used cascading truncation. Supabase is the sole application database, so accidental restarts or old commands must not erase or replace its stored data.

**How to apply:** Before changing database initialization or migration scripts, search for destructive DDL/DML, confirm whether code runs automatically, and require explicit destination/backup review before any destructive operation.
