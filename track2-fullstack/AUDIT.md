# Audit

## Summary

The app works for normal use but has accumulated silent drift around the denormalized `paddocks.animal_count` column. Loose input handling is the secondary theme. Most bugs are local fixes; one shared root cause becomes the architectural improvement.

## Issues, in priority order

### 1. PUT /animals/:id leaks paddock counts on move — `routes/animals.js`

Moving an animal between paddocks bumps the destination's `animal_count` but never decrements the source's. Every successful move corrupts the data and skews the capacity bars users see. Top priority because it fires on the normal flow, not an edge case. Fix: add the missing decrement and wrap both updates in a transaction.

### 2. Pagination uses `page` as offset instead of `page * limit` — `routes/animals.js`

`GET /animals` binds `page` directly to SQL `OFFSET`, so page 1 skips one row instead of five. Consecutive pages overlap and the UI feels broken on the first click. No data corruption, just visible breakage. One-line fix: `.all(limit, page * limit)`.

### 3. POST /animals corrupts paddock count on failed insert — `routes/animals.js`

The paddock count is incremented before the animal row is inserted. A duplicate `tag_number` leaves the count inflated with no animal to match. Same drift class as #1, but error-path only. Fix: insert first, then increment, both inside a transaction.

### 4. Frontend injects API data into `innerHTML` unescaped — `frontend/*.html`

All three pages build markup with template literals and assign to `innerHTML`. An animal named `<img src=x onerror=alert(1)>` would execute on every page that lists it. Fix: escape values or use `textContent`.

### 5. PUT lets `??` clear required fields — `routes/animals.js`

`req.body.name ?? animal.name` only falls back on `null`/`undefined`. A PUT with `{"name": ""}` silently clears the name despite POST requiring it. Fix: validate required fields are non-empty strings.

## What I'd leave for later

- **N+1 query in `GET /animals`** — fine at this scale.
- **DB errors return bare 500s** instead of 4xx with a message.
- **`POST /animals` returns 200 instead of 201** — cosmetic.
- **Pagination accepts unsafe values** — `?page=-5` throws, `?limit=999999` dumps the table.
- **"Fetch animal or 404" repeated five times** — middleware candidate.
- **No auth, no rate limiting** — out of scope.

## Architectural concern

Bugs #1 and #3 share a root cause: `paddocks.animal_count` is a denormalized cache hand-maintained across three routes. Migration plan in [`ARCH_PROPOSAL.md`](./ARCH_PROPOSAL.md).
