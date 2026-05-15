# Architectural Proposal: Derive paddocks.animal_count instead of caching

**Status:** Implemented in this commit. This document records the problem, the fix applied, and the rollback procedure.

## Problem
`paddocks.animal_count` is a denormalized cache of the number of animals assigned to each paddock. It's hand-maintained so every animal mutation route (`POST`, `PUT`, `DELETE /animals`) is responsible for incrementing or decrementing the count to keep it in sync. Two of the bugs flagged in AUDIT.md (#1 and #3) were caused by this design — `PUT` failed to decrement the source paddock on moves, and `POST` incremented before the insert, so a failed insert (e.g., duplicate `tag_number`) left an inflated count. Both are now patched, but the design itself remains fragile. Any future route, refactor, or human error can reintroduce the same drift.

## Solution: Compute on Read
Drop the `animal_count` column. Compute it on demand via a subquery wherever paddocks are returned. The `animals.paddock_id` foreign key is the source of truth and the query `SELECT COUNT(*) FROM animals WHERE paddock_id = ?` answers the question directly. The denormalized cache disappears, and the entire bug class (cache drift between writes) becomes structurally impossible.

## Schema Change
```sql
ALTER TABLE paddocks DROP COLUMN animal_count;
```
Additionally, remove the column from the `CREATE TABLE` statement in `db.js` for fresh deployments.


## Route Changes

### routes/paddocks.js
All three handlers (`GET /`, `GET /:id`, `POST /`) need their `SELECT` to include the derived field:
```sql
SELECT id, name, capacity,
(SELECT COUNT(*) FROM animals WHERE paddock_id = paddocks.id) AS animal_count
FROM paddocks
```
Extract this as a shared constant or template if duplicated.

### routes/animals.js
- `POST /` - remove the `UPDATE paddocks SET animal_count = animal_count + 1` block and the surrounding transaction
  wrapper (single write no longer needs one).
- `PUT /:id` - remove the `if (updates.paddock_id !== animal.paddock_id) { ... }` block that decrements the source
  paddock and increments the destination.
- `DELETE /:id` - remove the `UPDATE paddocks SET animal_count = animal_count - 1` block.

## API Contract
Response shape is unchanged. Clients still receive `animal_count` on paddock responses - only the computation method changes. No frontend updates required.

## Tests
In `test/api.test.js` (`seedTestData` function):
- Drop `animal_count` from the paddock `INSERT` columns.
- Remove the `UPDATE paddocks SET animal_count = ...` lines after each animal insert.

Existing tests that assert on `animal_count` continue to pass because the field is preserved in the response shape. No new tests required.

## Rollback 
If issues come up after deployment:

1. Revert the migration commit.
2. Recreate the column: `ALTER TABLE paddocks ADD COLUMN animal_count INTEGER NOT NULL DEFAULT 0`. Do it in place because this is safer especially with production data rather than seed data.
3. Backfill from the source: `UPDATE paddocks SET animal_count = (SELECT COUNT(*) FROM animals WHERE paddock_id = paddocks.id)`.

No data loss occurs - the value is fully derivable from `animals.paddock_id`.


