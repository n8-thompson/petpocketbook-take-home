# AI Usage Disclosure

## Tools used

- **Cursor** (IDE) with the Claude Opus 4.7 model as the in-editor coding agent.
  This was used in two modes:
  - **Plan mode** to scope the work, lay out architecture options (Rails vs. extending Express, React-only vs. Vite + React, PUT-only vs. PUT + DELETE, mobile trash handling), and capture trade-offs as a written plan before any code was written.
  - **Agent mode** to execute the plan: write files, run `npm install`, run the backend smoke tests, build the SPA, and run the concurrent dev server.

No separate browser/app-based tools (ChatGPT web, Claude web, Google, etc.) were used.

## How I used the tool

I drove the session as an interactive collaborator rather than a one-shot generator:

1. Read the existing scaffold and the README first to ground every decision in what was actually there (Express + Jade + `sqlite3` already pinned).
2. Asked Cursor to draft a plan in plan mode and pushed back on specifics: should we use Rails, what does the drag-and-drop library look like, should we have a dedicated `DELETE` route, is the trash being hidden on mobile actually safe given that `@dnd-kit` registers droppables regardless of CSS visibility (answer: no — we don't render `TrashZone` at all on mobile).
3. After confirming the plan, switched to agent mode and let it implement the backend first (PetPocketbook client, SQLite layer, routes), then ran end-to-end curl smoke tests through the agent before touching the frontend.
4. Reviewed every diff in the editor and shaped follow-ups (e.g. catching that the original plan only had GET/PUT and asking for DELETE; deciding to drop `@dnd-kit/sortable` since there's no in-slot ordering requirement).

The agent's main responsibilities were:
- File creation and editing (component files, CSS, routes, db layer).
- Running shell commands (`npm install`, `npm run build`, `curl` smoke tests, killing dev servers).
- Suggesting alternatives where there were trade-offs (e.g. "do you want Rails or Express?", "PUT-only vs PUT+DELETE?").

## What was hand-written vs AI-assisted

Roughly **90% of the implementation was AI-assisted** (Cursor agent writing the code under my direction). The remaining ~10% was direct human input:

- The architectural decisions (Express + SQLite, React + Vite, `@dnd-kit`, single-origin serving, optimistic updates with rollback).
- Catching gaps the agent missed on the first pass (no DELETE route, no explicit "trash not rendered on mobile" guarantee).
- Reviewing the generated code and tightening the responsive CSS / DnD UX.

Things I made sure the agent did *not* skip:
- Validating API inputs server-side (pet type enum, time-grid regex, duplicate ids).
- Stable UUIDs assigned at seed time (so optimistic updates and DELETE-by-id are safe).
- Not relying on `display: none` to hide the trash zone on mobile — the component is conditionally not rendered.

## Why this split

I leaned heavily on AI for boilerplate (Vite scaffold, Express plumbing, CSS, SVG icons) because that's where it's fastest and least error-prone. I stayed hands-on for the API contract, the data flow on drag end, and the mobile-vs-desktop conditional rendering, because those are the spots where a wrong call would silently break a requirement.
