-- Foundation board roster — officers, board members, and staff/advisors
-- all live in one table grouped by `category`. Photos are uploaded to the
-- public `media` bucket.

create table if not exists public.board_members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  title        text,                        -- "President", "Board Member", etc.
  category     text not null default 'board'
               check (category in ('officers', 'board', 'staff')),
  bio          text,
  image_url    text,
  image_alt    text,
  order_index  int not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_board_cat_order
  on public.board_members(category, order_index);

drop trigger if exists set_updated_at on public.board_members;
create trigger set_updated_at before update on public.board_members
  for each row execute function public.tg_set_updated_at();

alter table public.board_members enable row level security;

drop policy if exists anon_read_board on public.board_members;
create policy anon_read_board
  on public.board_members for select to anon
  using (published = true);
