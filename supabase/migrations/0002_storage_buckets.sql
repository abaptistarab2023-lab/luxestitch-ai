-- LuxeStitch AI: private storage bucket for optional inspiration images
-- file_size_limit / allowed_mime_types enforce server-side what the client
-- already checks, since the browser upload call can't be trusted alone.
-- "do update" (not "do nothing") keeps this idempotent if limits change later.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inspiration-images',
  'inspiration-images',
  false,
  5242880, -- 5MB, matches MAX_IMAGE_BYTES in ProjectForm.tsx
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Objects are keyed as {user_id}/{filename}; a user may only read/write
-- objects under their own user_id prefix (first path segment).
create policy "Users can view their own inspiration images"
  on storage.objects for select
  using (
    bucket_id = 'inspiration-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload their own inspiration images"
  on storage.objects for insert
  with check (
    bucket_id = 'inspiration-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
