---
name: Plesk GitHub deployment
description: Production deployment uses a committed dist build and a Node.js startup file relative to the application root.
---

For this project, Plesk must pull the versioned `dist` directory from GitHub; the production server starts `dist/index.cjs` and serves static files from `dist/public`.

The user configures required secret values themselves through the Secrets panel. Do not ask them to provide credentials or paste secret values into chat; check only whether the required secret is configured and wait if it is not.

**Why:** Plesk does not automatically see the Replit workspace build, and missing configuration causes deployment errors. The user will configure secret values themselves and explicitly asked not to be asked for them.

**How to apply:** Keep `dist` tracked for Plesk pulls, use `/dist/public` as the document root relative to the application root, use `dist/index.cjs` as the startup file, and use configured secret values such as `SUPABASE_DATABASE_URL` and `SESSION_SECRET` without displaying or requesting their contents.