/*
  # Remove Unused Database Indexes

  1. Changes
    - Drop unused index `idx_weeks_week_number` on weeks table
    - Drop unused index `idx_contributions_week_id` on contributions table
    - Drop unused index `idx_contributions_contributor_type` on contributions table
  
  2. Rationale
    - These indexes are not being used by queries
    - Removing unused indexes improves write performance
    - Reduces storage overhead
    - Simplifies database maintenance
  
  3. Notes
    - Only affects performance, no functional changes
    - Indexes can be recreated if query patterns change
*/

DROP INDEX IF EXISTS idx_weeks_week_number;
DROP INDEX IF EXISTS idx_contributions_week_id;
DROP INDEX IF EXISTS idx_contributions_contributor_type;