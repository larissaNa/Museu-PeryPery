-- Ensure profiles and user_roles tables exist
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Recreate trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email,'@',1)
    )
  ) on conflict (id) do nothing;

  select count(*) into v_count from public.user_roles;
  if v_count = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
      on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user')
      on conflict do nothing;
  end if;

  return new;
end;
$$;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-confirm all existing users in auth.users
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null;

-- Backfill profiles for all existing auth.users
insert into public.profiles (id, email, display_name)
select 
  id, 
  email, 
  coalesce(
    raw_user_meta_data->>'display_name',
    raw_user_meta_data->>'full_name',
    split_part(email, '@', 1)
  )
from auth.users
on conflict (id) do nothing;

-- Backfill user_roles for all existing auth.users
do $$
declare
  u record;
  v_count int;
  v_admin_count int;
begin
  for u in select id from auth.users order by created_at asc loop
    select count(*) into v_count from public.user_roles where user_id = u.id;
    if v_count = 0 then
      select count(*) into v_admin_count from public.user_roles where role = 'admin';
      if v_admin_count = 0 then
        insert into public.user_roles (user_id, role) values (u.id, 'admin')
          on conflict do nothing;
      else
        insert into public.user_roles (user_id, role) values (u.id, 'user')
          on conflict do nothing;
      end if;
    end if;
  end loop;
end $$;