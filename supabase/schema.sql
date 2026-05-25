-- GreenSpace Dilijan booking database schema.
-- Run this in the Supabase SQL editor for the project connected to the frontend.
-- The frontend must use only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allow-list of Supabase Auth users who can access private booking data and admin actions.';

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  check_in date not null,
  check_out date not null,
  guests integer not null,
  package_type text not null,
  horse_slots integer not null default 0,
  jeep_tour boolean not null default false,
  jeep_cars integer not null default 0,
  total_price integer,
  deposit_amount integer,
  remaining_amount integer,
  message text,
  status text not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_requests_status_check
    check (status in ('pending', 'confirmed', 'rejected', 'cancelled')),
  constraint booking_requests_dates_check check (check_in < check_out),
  constraint booking_requests_guests_check check (guests > 0),
  constraint booking_requests_horse_slots_check check (horse_slots >= 0),
  constraint booking_requests_jeep_cars_check check (jeep_cars >= 0)
);

comment on table public.booking_requests is
  'Private customer booking requests. Pending requests do not block dates and are not public.';

create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid references public.booking_requests(id) on delete cascade,
  check_in date not null,
  check_out date not null,
  reason text not null default 'confirmed booking',
  created_at timestamptz not null default now(),
  constraint blocked_dates_dates_check check (check_in < check_out)
);

comment on table public.blocked_dates is
  'Availability ranges blocked by confirmed bookings or manual admin blocks. Contains no customer contact details.';

create index if not exists booking_requests_status_idx on public.booking_requests(status);
create index if not exists booking_requests_created_at_idx on public.booking_requests(created_at desc);
create index if not exists booking_requests_dates_idx on public.booking_requests(check_in, check_out);
create index if not exists blocked_dates_range_idx on public.blocked_dates(check_in, check_out);
create index if not exists blocked_dates_booking_request_id_idx on public.blocked_dates(booking_request_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_booking_requests_updated_at on public.booking_requests;
create trigger set_booking_requests_updated_at
before update on public.booking_requests
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'Checks whether the signed-in Supabase Auth user is allow-listed as a GreenSpace admin.';

alter table public.admin_users enable row level security;
alter table public.booking_requests enable row level security;
alter table public.blocked_dates enable row level security;

drop policy if exists "Admins can read admin allow-list" on public.admin_users;
create policy "Admins can read admin allow-list"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can create pending booking requests" on public.booking_requests;
create policy "Public can create pending booking requests"
on public.booking_requests
for insert
to anon, authenticated
with check (
  status = 'pending'
  and admin_notes is null
);

drop policy if exists "Admins can read booking requests" on public.booking_requests;
create policy "Admins can read booking requests"
on public.booking_requests
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update booking requests" on public.booking_requests;
create policy "Admins can update booking requests"
on public.booking_requests
for update
to authenticated
using (public.is_admin())
with check (
  public.is_admin()
  and status in ('pending', 'confirmed', 'rejected', 'cancelled')
);

drop policy if exists "Public can read blocked dates for availability" on public.blocked_dates;
create policy "Public can read blocked dates for availability"
on public.blocked_dates
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert blocked dates" on public.blocked_dates;
create policy "Admins can insert blocked dates"
on public.blocked_dates
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update blocked dates" on public.blocked_dates;
create policy "Admins can update blocked dates"
on public.blocked_dates
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete blocked dates" on public.blocked_dates;
create policy "Admins can delete blocked dates"
on public.blocked_dates
for delete
to authenticated
using (public.is_admin());

-- First admin setup:
-- 1. Create an admin user in Supabase Auth.
-- 2. Insert that user's auth.users.id here:
-- insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000000');

