---
name: Authentication viewport
description: Persistent layout and field-icon requirements for login and registration.
---

The login, registration, and change-password pages must stay fixed to the viewport without page scrolling. Keep the Scotgold hero background and logo, and use the supplied phone, password, verification, and invitation icons. Show a clearly visible country-selector chevron before the dial code. The shared country-selection modal and the active country list configured by Admin must remain unchanged; never substitute fallback countries. Login and registration verification codes must be server-checked, single-use, session-bound, expiring, and rate-limited.

**Why:** The user requires the French auth pages to match the supplied references, preserve the existing branding and country modal, keep the pages fixed, make country selection obvious, and require verification codes on both login and registration.

**How to apply:** Keep all auth screens within the mobile viewport. Read active countries from the Admin-configured API, leave the shared selector untouched, and validate login and registration challenges on the server rather than trusting client-rendered text.
