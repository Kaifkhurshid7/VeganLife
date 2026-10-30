-- Supabase Storage buckets for user uploads.
--
--  * Buckets are PUBLIC for reading (images are shown on public pages), but there
--    are deliberately NO insert/update/delete policies: only the backend, using
--    the service-role key, can write. The publishable key cannot upload.
--  * The limits below are enforced by Storage itself, in addition to the checks
--    the API does before it ever sends a file (size, type, real image decode,
--    resize). Avatars: 2 MB, JPEG/PNG/WebP. Post images: 5 MB, JPEG/PNG/WebP/GIF.
--
-- Skipped automatically on a plain Postgres (no `storage` schema), e.g. in tests.

do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values
      ('avatars',     'avatars',     true, 2097152, array['image/jpeg','image/png','image/webp']),
      ('post-images', 'post-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
    on conflict (id) do update
      set public = excluded.public,
          file_size_limit = excluded.file_size_limit,
          allowed_mime_types = excluded.allowed_mime_types;
  end if;
end $$;
