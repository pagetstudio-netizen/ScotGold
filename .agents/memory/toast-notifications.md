---
name: Toast notification appearance
description: User-specified shared toast style across the app, preserving white modals.
---

Across the entire app, use one shared toast appearance: a centered, translucent charcoal popup with simple white text, no decorative exclamation icon, and no more than two visible lines. Keep a clear inset from every viewport edge, animate entry and exit, respect reduced-motion preferences, and show toasts for 2.5 seconds. This applies to RobotPay too. Do not alter white modal/dialog styling.

**Why:** The user requested a plain, centered, one- or two-line notification matching their reference across all app routes, while explicitly preserving white modals.

**How to apply:** Use the shared toast component for notifications, keep standard and destructive toasts visually consistent, retain their full text accessibly even when clamped visually, preserve a minimum 24px mobile edge inset, and leave white modal/dialog components untouched.