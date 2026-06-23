
-- search_path em set_updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- Revoga EXECUTE público nas SECURITY DEFINER (usadas apenas internamente em policies/triggers)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.is_staff(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.log_acervo_change() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
