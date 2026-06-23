-- Grant select on storage_path and storage_bucket to anonymous users so the gallery can load images
GRANT SELECT (storage_path, storage_bucket) ON public.user_images TO anon;
