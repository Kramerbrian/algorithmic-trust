create extension if not exists "pgcrypto";
create table if not exists public.scans ( id uuid primary key default gen_random_uuid(), dealer_key text not null, payload jsonb not null, created_at timestamptz not null default now() );
create index if not exists scans_dealer_created_idx on public.scans (dealer_key, created_at desc);
create table if not exists public.dealers ( dealer_key text primary key, label text not null, brand text, city text, state text, active boolean default true, daily_probe_enabled boolean default true, created_at timestamptz default now());
create or replace function public.prune_scans(max_keep int default 200) returns int language plpgsql as $$
declare v_deleted int; begin with ranked as ( select id, row_number() over (partition by dealer_key order by created_at desc) rn from public.scans ), del as ( delete from public.scans s using ranked r where s.id = r.id and r.rn > max_keep returning 1 ) select count(*) into v_deleted from del; return coalesce(v_deleted,0); end $$;
alter table public.scans enable row level security;
alter table public.dealers enable row level security;
insert into public.dealers (dealer_key,label,brand,city,state) values ('default','Default Dealer','Toyota','Naples','FL') on conflict (dealer_key) do nothing;
