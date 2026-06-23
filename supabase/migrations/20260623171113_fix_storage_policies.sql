-- Ensure bucket 'museum-images' exists and is public
insert into storage.buckets (id, name, public)
values ('museum-images', 'museum-images', true)
on conflict (id) do update set public = true;

-- Drop existing storage policies for 'museum-images' to avoid duplicate errors
drop policy if exists "museum public read" on storage.objects;
drop policy if exists "museum user upload pending" on storage.objects;
drop policy if exists "museum user read own pending" on storage.objects;
drop policy if exists "museum staff all" on storage.objects;

-- 1) Leitura pública das pastas públicas
create policy "museum public read"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'museum-images'
    and (
      (storage.foldername(name))[1] in ('public','acervo','events','timeline','contributions')
    )
  );

-- 2) Autenticado pode subir na sua pasta pending/<uid>/
create policy "museum user upload pending"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'museum-images'
    and (storage.foldername(name))[1] = 'pending'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- 3) Autenticado pode ver seus próprios uploads pendentes
create policy "museum user read own pending"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'museum-images'
    and (storage.foldername(name))[1] = 'pending'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- 4) Staff (admin/curator) pode gerenciar tudo no bucket
create policy "museum staff all"
  on storage.objects for all to authenticated
  using (bucket_id = 'museum-images' and public.is_staff(auth.uid()))
  with check (bucket_id = 'museum-images' and public.is_staff(auth.uid()));
