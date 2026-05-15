# Retro

## Trade-offs
- **422 for weights validation instead of 400.**
The existing `POST /animals/:id/health-events` returns 400 for missing required fields, but the TODO.md spec specifies 422 for the equivalent weights validation. I followed the spec, creating an inconsistency. Standardizing both on 422 would be the right cleanup (correct code for a well-formed request with invalid data), but extending it to health-events was out of scope.

## With more time
- **Split nested sub-resources into dedicated router files.**
Currently `routes/animals.js` handles animal CRUD, health events, and weights in one file. With more time, I would extract `routes/health-events.js` and `routes/weights.js` as a separation of concerns so animals.js handles the CRUD whilst the other components are in the other files.

## Left alone deliberately
- **Pagination accepts unsafe values.** `?limit=999999` could return the entire table (memory pressure), and
`?page=-5` triggers a bare 500. Trivial at seed size; before production, I would clamp `limit` to a fair max and reject negative
`page`.
- **N+1 query in `GET /animals`.** Each animal row triggers a separate query for its latest health event. Negligible at
this scale; before production I would batch-fetch events for all returned animal IDs in one query.
- **DB constraint violations return bare 500s instead of semantic 4xx.** A duplicate `tag_number` on `POST /animals`
currently returns 500 when it should be 409 Conflict. Fine at this scope; before production I would map known constraint
errors to appropriate 4xx codes with clear messages.



