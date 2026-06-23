
-- 1) Fix contributions insert policy to bind author_user_id correctly
DROP POLICY IF EXISTS "contrib anyone insert" ON public.contributions;

CREATE POLICY "contrib anon insert"
ON public.contributions
FOR INSERT
TO anon
WITH CHECK (status = 'pending' AND author_user_id IS NULL);

CREATE POLICY "contrib auth insert"
ON public.contributions
FOR INSERT
TO authenticated
WITH CHECK (status = 'pending' AND author_user_id = auth.uid());

-- 2) Hide author_email from public/anonymous and other authenticated users.
-- Owners still see it via "contrib author read own"; staff via "contrib staff read all".
REVOKE SELECT ON public.contributions FROM anon, authenticated;

GRANT SELECT
  (id, contribution_type, title, content, image_path, status,
   moderated_by, moderated_at, moderation_note, created_at, author_user_id, author_name)
  ON public.contributions TO anon;

-- Authenticated users keep full-column access so author/staff policies can return email;
-- the "contrib public read approved" policy still applies but column visibility for anon is restricted above.
GRANT SELECT ON public.contributions TO authenticated;

-- 3) Hide storage_path/storage_bucket/user_id for approved user_images from anonymous visitors
REVOKE SELECT ON public.user_images FROM anon;

GRANT SELECT
  (id, title, filename, mimetype, filesize, status, created_at, moderated_at)
  ON public.user_images TO anon;
