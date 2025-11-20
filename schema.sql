-- Create Users table
create table users (
  id text primary key,
  whop_id text unique not null,
  avatar text,
  otp text,
  otp_expires bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Linked Accounts table
create table linked_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id text references users(id) on delete cascade,
  platform text not null,
  handle text not null,
  platform_user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, platform)
);

-- Create Metrics table
create table metrics (
  id uuid default gen_random_uuid() primary key,
  user_id text references users(id) on delete cascade,
  views bigint default 0,
  shares bigint default 0,
  earnings bigint default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create Achievements table
create table achievements (
  id uuid default gen_random_uuid() primary key,
  user_id text references users(id) on delete cascade,
  achievement_id text not null,
  name text not null,
  icon text not null,
  date bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Clips table
create table clips (
  id text primary key,
  user_id text references users(id) on delete cascade,
  platform text not null,
  url text not null,
  thumbnail text,
  views bigint default 0,
  likes bigint default 0,
  posted_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, url)
);

-- Create Metric Snapshots table (for Rising Stars)
create table metric_snapshots (
  id uuid default gen_random_uuid() primary key,
  user_id text references users(id) on delete cascade,
  views bigint default 0,
  followers bigint default 0,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);
