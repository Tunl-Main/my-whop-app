-- Create Users table
create table users (
  id text primary key,
  whop_id text unique not null,
  username text,
  avatar text,
  otp text,
  otp_expires bigint,
  pledged_community_id text,              -- References communities(id), added after communities table exists
  pledged_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add foreign key constraint after communities table is created
-- ALTER TABLE users ADD CONSTRAINT fk_users_community FOREIGN KEY (pledged_community_id) REFERENCES communities(id);

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
  likes bigint default 0,
  shares bigint default 0,
  earnings bigint default 0,
  avg_views bigint default 0,
  avg_likes BIGINT DEFAULT 0,
  total_posts INTEGER DEFAULT 0,
  viral_clips INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) not null,
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

-- Create Communities table (auto-detected + admin curated)
create table communities (
  id text primary key,                    -- Whop experience_id
  name text not null,
  icon_url text,
  total_members integer default 0,
  total_views bigint default 0,
  total_clips integer default 0,
  is_featured boolean default false,      -- Admin can feature
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add pledge columns to users (run as ALTER if table already exists)
-- ALTER TABLE users ADD COLUMN pledged_community_id TEXT REFERENCES communities(id);
-- ALTER TABLE users ADD COLUMN pledged_at TIMESTAMP WITH TIME ZONE;
