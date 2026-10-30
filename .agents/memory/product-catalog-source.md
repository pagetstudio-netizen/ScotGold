---
name: Product catalog source
description: Product offers are database-managed, not restored from hardcoded seed data.
---

Treat the database as the source of truth for product names, prices, daily earnings, duration, and total return. Startup should preserve database-managed offers and must not insert or overwrite a fixed product catalog.

**Why:** the user asked that product changes be stored in the database rather than hardcoded, so administrator-managed catalog edits remain authoritative.

**How to apply:** read offers from the products table in user-facing and admin flows; keep one-off catalog edits out of recurring seed logic.
