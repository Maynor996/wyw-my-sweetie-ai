-- Promote an existing account to super_admin (idempotent; touches only hl_* tables).
-- Usage (after the person has signed up on the site):
--   npx wrangler d1 execute seedream-studio-db --remote --file=scripts/d1/promote-super-admin.sql
-- Edit the email below if needed.
INSERT INTO hl_user_role (id, user_id, role_id, created_at, updated_at)
SELECT lower(hex(randomblob(16))), u.id, r.id,
       cast((julianday('now') - 2440587.5)*86400000 as integer),
       cast((julianday('now') - 2440587.5)*86400000 as integer)
FROM hl_user u JOIN hl_role r ON r.name = 'super_admin'
WHERE lower(u.email) = lower('bgnwd15@gmail.com')
  AND NOT EXISTS (SELECT 1 FROM hl_user_role ur WHERE ur.user_id = u.id AND ur.role_id = r.id);
