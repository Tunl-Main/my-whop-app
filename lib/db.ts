import { supabase } from './supabase';

export interface LinkedAccount {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  handle: string;
  id: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  date: number;
}

export interface User {
  id: string;
  whopId: string;
  username?: string;
  linkedAccounts: LinkedAccount[];
  avatar?: string;
  metrics: {
    views: number;
    likes: number;
    shares: number;
    earnings?: number;
    avg_views?: number;
    avg_likes?: number;
    total_posts?: number;
    viral_clips?: number;
  };
  achievements: Achievement[];
  otp?: string;
  otpExpires?: number;
}

// Helper to transform Supabase result to User object
function transformUser(row: any): User {
  return {
    id: row.id,
    whopId: row.whop_id,
    username: row.username,
    avatar: row.avatar,
    otp: row.otp,
    otpExpires: row.otp_expires,
    linkedAccounts: row.linked_accounts?.map((acc: any) => ({
      platform: acc.platform,
      handle: acc.handle,
      id: acc.platform_user_id
    })) || [],
    metrics: {
      views: Array.isArray(row.metrics) ? (row.metrics[0]?.views || 0) : (row.metrics?.views || 0),
      likes: Array.isArray(row.metrics) ? (row.metrics[0]?.likes || 0) : (row.metrics?.likes || 0),
      shares: Array.isArray(row.metrics) ? (row.metrics[0]?.shares || 0) : (row.metrics?.shares || 0),
      earnings: Array.isArray(row.metrics) ? (row.metrics[0]?.earnings || 0) : (row.metrics?.earnings || 0),
      avg_views: Array.isArray(row.metrics) ? (row.metrics[0]?.avg_views || 0) : (row.metrics?.avg_views || 0),
      avg_likes: Array.isArray(row.metrics) ? (row.metrics[0]?.avg_likes || 0) : (row.metrics?.avg_likes || 0),
      total_posts: Array.isArray(row.metrics) ? (row.metrics[0]?.total_posts || 0) : (row.metrics?.total_posts || 0),
      viral_clips: Array.isArray(row.metrics) ? (row.metrics[0]?.viral_clips || 0) : (row.metrics?.viral_clips || 0),
    },
    achievements: row.achievements?.map((ach: any) => ({
      id: ach.achievement_id,
      name: ach.name,
      icon: ach.icon,
      date: ach.date
    })) || []
  };
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      linked_accounts (*),
      metrics (*),
      achievements (*)
    `);

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data.map(transformUser);
}

export async function getUser(whopId: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      linked_accounts (*),
      metrics (*),
      achievements (*)
    `)
    .eq('whop_id', whopId)
    .single();

  if (error || !data) return undefined;
  return transformUser(data);
}

export async function getUserByOTP(otp: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      linked_accounts (*),
      metrics (*),
      achievements (*)
    `)
    .eq('otp', otp)
    .single();

  if (error || !data) return undefined;
  return transformUser(data);
}

export async function createUser(user: User) {
  // 1. Create User
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: user.id,
      whop_id: user.whopId,
      username: user.username,
      avatar: user.avatar,
      otp: user.otp,
      otp_expires: user.otpExpires
    });

  if (userError) {
    console.error('Error creating user:', userError);
    throw new Error(`Failed to create user: ${userError.message}`);
  }

  // 2. Create Metrics entry
  const { error: metricsError } = await supabase
    .from('metrics')
    .insert({
      user_id: user.id,
      views: user.metrics.views,
      shares: user.metrics.shares,
      earnings: user.metrics.earnings
    });

  if (metricsError) console.error('Error creating metrics:', metricsError);
}

export async function updateUser(whopId: string, updates: Partial<User>) {
  // Map camelCase to snake_case for DB
  const dbUpdates: any = {};
  if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
  if (updates.otp !== undefined) dbUpdates.otp = updates.otp;
  if (updates.otpExpires !== undefined) dbUpdates.otp_expires = updates.otpExpires;

  if (Object.keys(dbUpdates).length > 0) {
    await supabase
      .from('users')
      .update(dbUpdates)
      .eq('whop_id', whopId);
  }
}

export async function updateLinkedAccount(userId: string, account: LinkedAccount) {
  // First check if exists to update or insert
  // For simplicity in this demo, we'll delete existing for platform and insert new

  const { error: deleteError } = await supabase
    .from('linked_accounts')
    .delete()
    .eq('user_id', userId)
    .eq('platform', account.platform);

  if (deleteError) console.error("DB: Error deleting linked account:", deleteError);

  const { error: insertError } = await supabase
    .from('linked_accounts')
    .insert({
      user_id: userId,
      platform: account.platform,
      handle: account.handle,
      platform_user_id: account.id
    });

  if (insertError) {
    console.error("DB: Error inserting linked account:", insertError);
    throw new Error(`Failed to link account: ${insertError.message}`);
  }
}

export async function addMetric(userId: string, metric: keyof User['metrics'], value: number) {
  // We need to fetch current value first or use an RPC for atomic increment
  // For now, we'll just fetch and update
  const { data } = await supabase
    .from('metrics')
    .select(metric)
    .eq('user_id', userId)
    .single();

  if (data) {
    const current = (data as any)[metric] || 0;
    await supabase
      .from('metrics')
      .update({ [metric]: current + value })
      .eq('user_id', userId);
  }
}

export interface Clip {
  id: string;
  thumbnail: string;
  views: number;
  likes: number;
  url: string;
  creator: {
    username: string;
    avatar: string;
  };
}

export async function getTopClips(limit: number = 10, range: 'week' | 'month' | 'all' = 'all'): Promise<Clip[]> {
  let query = supabase
    .from('clips')
    .select(`
      *,
      users (
        whop_id,
        username,
        avatar,
        linked_accounts (
          platform,
          handle
        )
      )
    `)
    .order('views', { ascending: false })
    .limit(limit);

  if (range === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte('posted_at', weekAgo);
  } else if (range === 'month') {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte('posted_at', monthAgo);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clips:', error);
    return [];
  }

  return data.map((row: any) => {
    // Find the linked account that matches the clip's platform
    const linkedAccount = row.users?.linked_accounts?.find(
      (acc: any) => acc.platform === row.platform
    );

    // Prioritize stored username, then Whop ID, then fallback to linked account handle
    const username = row.users?.username || row.users?.whop_id || linkedAccount?.handle || row.users?.linked_accounts?.[0]?.handle || 'Unknown';

    return {
      id: row.id,
      thumbnail: row.thumbnail || '',
      views: row.views,
      likes: row.likes,
      url: row.url,
      creator: {
        username: username,
        avatar: row.users?.avatar || ''
      }
    };
  });
}

export async function getLeaderboardData(range: 'week' | 'month' | 'all' = 'week'): Promise<User[]> {
  // 1. Calculate start date based on range
  let startDate: string | null = null;
  const now = new Date();

  if (range === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    startDate = weekAgo.toISOString();
  } else if (range === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    startDate = monthAgo.toISOString();
  }

  // 2. Fetch Users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select(`
      *,
      linked_accounts (*),
      achievements (*)
    `);

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return [];
  }

  // 3. Fetch Clips (filtered by date if needed)
  let query = supabase
    .from('clips')
    .select('user_id, views, likes, posted_at');

  if (startDate) {
    query = query.gte('posted_at', startDate);
  }

  const { data: clips, error: clipsError } = await query;

  if (clipsError) {
    console.error('Error fetching clips:', clipsError);
    return [];
  }

  // 4. Aggregate Metrics per User
  const userMetrics = new Map<string, { views: number; likes: number; viral_clips: number }>();

  clips?.forEach((clip: any) => {
    const current = userMetrics.get(clip.user_id) || { views: 0, likes: 0, viral_clips: 0 };

    current.views += clip.views || 0;
    current.likes += clip.likes || 0;
    if ((clip.views || 0) >= 100000) {
      current.viral_clips += 1;
    }

    userMetrics.set(clip.user_id, current);
  });

  // 5. Transform and Merge Data
  return users.map((row: any) => {
    const metrics = userMetrics.get(row.id) || { views: 0, likes: 0, viral_clips: 0 };

    return {
      id: row.id,
      whopId: row.whop_id,
      avatar: row.avatar,
      otp: row.otp,
      otpExpires: row.otp_expires,
      linkedAccounts: row.linked_accounts?.map((acc: any) => ({
        platform: acc.platform,
        handle: acc.handle,
        id: acc.platform_user_id
      })) || [],
      metrics: {
        views: metrics.views,
        likes: metrics.likes,
        shares: 0, // Not tracked in clips yet
        earnings: 0, // Not tracked in clips yet
        viral_clips: metrics.viral_clips,
        avg_views: 0, // Could calculate if needed
        avg_likes: 0,
        total_posts: 0
      },
      achievements: row.achievements?.map((ach: any) => ({
        id: ach.achievement_id,
        name: ach.name,
        icon: ach.icon,
        date: ach.date
      })) || []
    };
  });
}
