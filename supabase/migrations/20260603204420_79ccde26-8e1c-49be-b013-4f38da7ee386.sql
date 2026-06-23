
-- =====================================================================
-- ENUM de papéis
-- =====================================================================
do $$ begin
  create type public.app_role as enum ('admin', 'curator', 'user');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- PROFILES
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "profiles self select" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles self update" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- =====================================================================
-- USER_ROLES
-- =====================================================================
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- security-definer helpers (sem recursão)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('admin','curator')
  );
$$;

create policy "user_roles select own" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "user_roles admin select all" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "user_roles admin insert" on public.user_roles
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "user_roles admin update" on public.user_roles
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "user_roles admin delete" on public.user_roles
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- admins (via staff) podem ver todos os perfis
create policy "profiles staff select all" on public.profiles
  for select to authenticated using (public.is_staff(auth.uid()));

-- =====================================================================
-- TRIGGER: novo usuário -> profile + role
-- O PRIMEIRO usuário cadastrado vira admin (bootstrap).
-- =====================================================================
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- ACERVO_ITEMS
-- =====================================================================
create table if not exists public.acervo_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  dating text,
  image_path text,
  status text not null default 'active' check (status in ('active','archived')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.acervo_items to anon;
grant select, insert, update, delete on public.acervo_items to authenticated;
grant all on public.acervo_items to service_role;
alter table public.acervo_items enable row level security;

create policy "acervo public read active" on public.acervo_items
  for select to anon, authenticated using (status = 'active');
create policy "acervo staff read all" on public.acervo_items
  for select to authenticated using (public.is_staff(auth.uid()));
create policy "acervo staff insert" on public.acervo_items
  for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "acervo staff update" on public.acervo_items
  for update to authenticated using (public.is_staff(auth.uid()));
create policy "acervo staff delete" on public.acervo_items
  for delete to authenticated using (public.is_staff(auth.uid()));

-- =====================================================================
-- ACERVO_AUDIT
-- =====================================================================
create table if not exists public.acervo_audit (
  id uuid primary key default gen_random_uuid(),
  acervo_id uuid references public.acervo_items(id) on delete set null,
  action text not null,
  performed_by uuid references auth.users(id) on delete set null,
  details jsonb,
  created_at timestamptz not null default now()
);

grant select on public.acervo_audit to authenticated;
grant all on public.acervo_audit to service_role;
alter table public.acervo_audit enable row level security;

create policy "audit staff read" on public.acervo_audit
  for select to authenticated using (public.is_staff(auth.uid()));

create or replace function public.log_acervo_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_action text;
begin
  if tg_op = 'INSERT' then v_action := 'create';
  elsif tg_op = 'DELETE' then v_action := 'delete';
  elsif tg_op = 'UPDATE' then
    if new.status = 'archived' and (old.status is distinct from 'archived') then
      v_action := 'archive';
    else v_action := 'update';
    end if;
  end if;

  insert into public.acervo_audit (acervo_id, action, performed_by, details)
  values (
    coalesce(new.id, old.id),
    v_action,
    auth.uid(),
    jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
  );
  return coalesce(new, old);
end;$$;

drop trigger if exists trg_log_acervo on public.acervo_items;
create trigger trg_log_acervo
  after insert or update or delete on public.acervo_items
  for each row execute function public.log_acervo_change();

-- =====================================================================
-- EVENTS
-- =====================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  location text,
  cover_image_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;

create policy "events public read" on public.events
  for select to anon, authenticated using (true);
create policy "events staff insert" on public.events
  for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "events staff update" on public.events
  for update to authenticated using (public.is_staff(auth.uid()));
create policy "events staff delete" on public.events
  for delete to authenticated using (public.is_staff(auth.uid()));

-- =====================================================================
-- TIMELINE_EVENTS
-- =====================================================================
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  description text,
  icon text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.timeline_events to anon;
grant select, insert, update, delete on public.timeline_events to authenticated;
grant all on public.timeline_events to service_role;
alter table public.timeline_events enable row level security;

create policy "timeline public read" on public.timeline_events
  for select to anon, authenticated using (true);
create policy "timeline staff insert" on public.timeline_events
  for insert to authenticated with check (public.is_staff(auth.uid()));
create policy "timeline staff update" on public.timeline_events
  for update to authenticated using (public.is_staff(auth.uid()));
create policy "timeline staff delete" on public.timeline_events
  for delete to authenticated using (public.is_staff(auth.uid()));

-- =====================================================================
-- CONTRIBUTIONS
-- =====================================================================
create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid references auth.users(id) on delete set null,
  author_name text,
  author_email text,
  contribution_type text not null check (contribution_type in ('relato','foto','memoria','sugestao')),
  title text,
  content text,
  image_path text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  moderated_by uuid references auth.users(id) on delete set null,
  moderated_at timestamptz,
  moderation_note text,
  created_at timestamptz not null default now()
);

grant select, insert on public.contributions to anon;
grant select, insert, update, delete on public.contributions to authenticated;
grant all on public.contributions to service_role;
alter table public.contributions enable row level security;

create policy "contrib public read approved" on public.contributions
  for select to anon, authenticated using (status = 'approved');
create policy "contrib author read own" on public.contributions
  for select to authenticated using (auth.uid() = author_user_id);
create policy "contrib staff read all" on public.contributions
  for select to authenticated using (public.is_staff(auth.uid()));
create policy "contrib anyone insert" on public.contributions
  for insert to anon, authenticated with check (status = 'pending');
create policy "contrib staff update" on public.contributions
  for update to authenticated using (public.is_staff(auth.uid()));
create policy "contrib staff delete" on public.contributions
  for delete to authenticated using (public.is_staff(auth.uid()));

-- =====================================================================
-- USER_IMAGES (legado)
-- =====================================================================
create table if not exists public.user_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  storage_bucket text not null default 'museum-images',
  storage_path text not null,
  filename text,
  mimetype text,
  filesize int,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  moderated_by uuid references auth.users(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now()
);

grant select on public.user_images to anon;
grant select, insert, update, delete on public.user_images to authenticated;
grant all on public.user_images to service_role;
alter table public.user_images enable row level security;

create policy "ui public read approved" on public.user_images
  for select to anon, authenticated using (status = 'approved');
create policy "ui author read own" on public.user_images
  for select to authenticated using (auth.uid() = user_id);
create policy "ui staff read all" on public.user_images
  for select to authenticated using (public.is_staff(auth.uid()));
create policy "ui author insert" on public.user_images
  for insert to authenticated with check (auth.uid() = user_id);
create policy "ui staff update" on public.user_images
  for update to authenticated using (public.is_staff(auth.uid()));
create policy "ui staff delete" on public.user_images
  for delete to authenticated using (public.is_staff(auth.uid()));

-- =====================================================================
-- updated_at trigger genérico
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;$$;

drop trigger if exists trg_acervo_updated on public.acervo_items;
create trigger trg_acervo_updated before update on public.acervo_items
  for each row execute function public.set_updated_at();

drop trigger if exists trg_events_updated on public.events;
create trigger trg_events_updated before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
