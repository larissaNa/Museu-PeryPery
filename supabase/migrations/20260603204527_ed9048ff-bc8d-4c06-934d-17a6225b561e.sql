
-- Leitura pública das pastas públicas
create policy "museum public read"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'museum-images'
    and (
      (storage.foldername(name))[1] in ('public','acervo','events','timeline','contributions')
    )
  );

-- Autenticado pode subir na sua pasta pending/<uid>/
create policy "museum user upload pending"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'museum-images'
    and (storage.foldername(name))[1] = 'pending'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- Autenticado pode ver seus próprios uploads pendentes
create policy "museum user read own pending"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'museum-images'
    and (storage.foldername(name))[1] = 'pending'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- Staff (admin/curator) pode gerenciar tudo no bucket
create policy "museum staff all"
  on storage.objects for all to authenticated
  using (bucket_id = 'museum-images' and public.is_staff(auth.uid()))
  with check (bucket_id = 'museum-images' and public.is_staff(auth.uid()));
