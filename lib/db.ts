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
  pledgedCommunityId?: string;
  pledgedAt?: string;
}

export interface Community {
  id: string;           // Whop experience_id
  name: string;
  iconUrl: string | null;
  joinUrl: string | null;
  totalMembers: number;
  totalViews: number;
  totalClips: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityLeaderboardEntry extends Community {
  topClipper?: {
    username: string;
    avatar: string;
    views: number;
  };
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
    pledgedCommunityId: row.pledged_community_id || undefined,
    pledgedAt: row.pledged_at || undefined,
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

export async function getTopClips(
  limit: number = 10, 
  range: 'week' | 'month' | 'all' = 'all',
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
): Promise<Clip[]> {
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

  // Filter by platform if specified
  if (platform) {
    query = query.eq('platform', platform);
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

export async function getLeaderboardData(
  range: 'week' | 'month' | 'all' = 'week',
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'twitter',
  communityId?: string
): Promise<User[]> {
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

  // 2. Fetch Users with metrics (includes earnings)
  let usersQuery = supabase
    .from('users')
    .select(`
      *,
      linked_accounts (*),
      achievements (*),
      metrics (earnings)
    `);

  // Filter by community if specified
  if (communityId) {
    usersQuery = usersQuery.eq('pledged_community_id', communityId);
  }

  const { data: users, error: usersError } = await usersQuery;

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return [];
  }

  // 3. Fetch Clips (filtered by date and optionally by platform)
  let query = supabase
    .from('clips')
    .select('user_id, views, likes, posted_at, platform');

  if (startDate) {
    query = query.gte('posted_at', startDate);
  }

  // Filter by platform if specified
  if (platform) {
    query = query.eq('platform', platform);
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
    const clipMetrics = userMetrics.get(row.id) || { views: 0, likes: 0, viral_clips: 0 };
    // Get earnings from the metrics table (can be array or single object)
    const metricsRow = Array.isArray(row.metrics) ? row.metrics[0] : row.metrics;
    const earnings = metricsRow?.earnings || 0;

    return {
      id: row.id,
      whopId: row.whop_id,
      username: row.username,
      avatar: row.avatar,
      otp: row.otp,
      otpExpires: row.otp_expires,
      pledgedCommunityId: row.pledged_community_id || undefined,
      pledgedAt: row.pledged_at || undefined,
      linkedAccounts: row.linked_accounts?.map((acc: any) => ({
        platform: acc.platform,
        handle: acc.handle,
        id: acc.platform_user_id
      })) || [],
      metrics: {
        views: clipMetrics.views,
        likes: clipMetrics.likes,
        shares: 0,
        earnings: earnings,
        viral_clips: clipMetrics.viral_clips,
        avg_views: 0,
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

// ============================================================
// COMMUNITY FUNCTIONS
// ============================================================

/**
 * Get all communities, optionally filtered by featured status
 */
export async function getCommunities(featuredOnly: boolean = false): Promise<Community[]> {
  let query = supabase
    .from('communities')
    .select('*')
    .order('total_views', { ascending: false });

  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[db] getCommunities failed:', error);
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    iconUrl: row.icon_url,
    joinUrl: row.join_url || null,
    totalMembers: row.total_members || 0,
    totalViews: row.total_views || 0,
    totalClips: row.total_clips || 0,
    isFeatured: row.is_featured || false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Get a single community by ID
 */
export async function getCommunity(communityId: string): Promise<Community | null> {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('id', communityId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('[db] getCommunity failed:', error);
    throw new Error(`Failed to fetch community: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    iconUrl: data.icon_url,
    joinUrl: data.join_url || null,
    totalMembers: data.total_members || 0,
    totalViews: data.total_views || 0,
    totalClips: data.total_clips || 0,
    isFeatured: data.is_featured || false,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Create or update a community record
 * Auto-detects from Whop experience when users visit
 */
export async function upsertCommunity(
  experienceId: string,
  name: string,
  iconUrl: string | null
): Promise<Community> {
  const { data, error } = await supabase
    .from('communities')
    .upsert({
      id: experienceId,
      name,
      icon_url: iconUrl,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id',
    })
    .select()
    .single();

  if (error) {
    console.error('[db] upsertCommunity failed:', error);
    throw new Error(`Failed to upsert community: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    iconUrl: data.icon_url,
    joinUrl: data.join_url || null,
    totalMembers: data.total_members || 0,
    totalViews: data.total_views || 0,
    totalClips: data.total_clips || 0,
    isFeatured: data.is_featured || false,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Set a user's pledged community
 */
export async function pledgeToCommunity(userId: string, communityId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({
      pledged_community_id: communityId,
      pledged_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('[db] pledgeToCommunity failed:', error);
    throw new Error(`Failed to pledge to community: ${error.message}`);
  }
}

/**
 * Get a user's pledged community with details
 */
export async function getUserPledgedCommunity(userId: string): Promise<Community | null> {
  const { data, error } = await supabase
    .from('users')
    .select('pledged_community_id')
    .eq('id', userId)
    .single();

  if (error || !data?.pledged_community_id) {
    return null;
  }

  return getCommunity(data.pledged_community_id);
}

/**
 * Get community leaderboard with aggregated stats
 * Returns communities ranked by total views with top clipper info
 */
export async function getCommunityLeaderboard(): Promise<CommunityLeaderboardEntry[]> {
  // 1. Fetch all communities
  const { data: communities, error: communitiesError } = await supabase
    .from('communities')
    .select('*')
    .order('total_views', { ascending: false });

  if (communitiesError) {
    console.error('[db] getCommunityLeaderboard failed:', communitiesError);
    throw new Error(`Failed to fetch community leaderboard: ${communitiesError.message}`);
  }

  // 2. For each community, calculate aggregated stats from users
  const result: CommunityLeaderboardEntry[] = [];

  for (const community of communities || []) {
    // Get users in this community with their clips
    const { data: users } = await supabase
      .from('users')
      .select(`
        id,
        username,
        avatar,
        clips (views)
      `)
      .eq('pledged_community_id', community.id);

    let totalViews = 0;
    let totalClips = 0;
    let topClipper: { username: string; avatar: string; views: number } | undefined;
    let maxUserViews = 0;

    (users || []).forEach((user: any) => {
      const userViews = (user.clips || []).reduce((sum: number, clip: any) => sum + (clip.views || 0), 0);
      const userClips = (user.clips || []).length;

      totalViews += userViews;
      totalClips += userClips;

      if (userViews > maxUserViews) {
        maxUserViews = userViews;
        topClipper = {
          username: user.username || 'Unknown',
          avatar: user.avatar || '',
          views: userViews,
        };
      }
    });

    result.push({
      id: community.id,
      name: community.name,
      iconUrl: community.icon_url,
      joinUrl: community.join_url || null,
      totalMembers: (users || []).length,
      totalViews,
      totalClips,
      isFeatured: community.is_featured || false,
      createdAt: community.created_at,
      updatedAt: community.updated_at,
      topClipper,
    });
  }

  // Sort by total views descending
  result.sort((a, b) => b.totalViews - a.totalViews);

  return result;
}

/**
 * Update community stats (call periodically via cron)
 */
export async function updateCommunityStats(communityId: string): Promise<void> {
  // Get users in this community with their clips
  const { data: users } = await supabase
    .from('users')
    .select(`
      id,
      clips (views)
    `)
    .eq('pledged_community_id', communityId);

  let totalViews = 0;
  let totalClips = 0;

  (users || []).forEach((user: any) => {
    const userViews = (user.clips || []).reduce((sum: number, clip: any) => sum + (clip.views || 0), 0);
    const userClips = (user.clips || []).length;

    totalViews += userViews;
    totalClips += userClips;
  });

  const { error } = await supabase
    .from('communities')
    .update({
      total_members: (users || []).length,
      total_views: totalViews,
      total_clips: totalClips,
      updated_at: new Date().toISOString(),
    })
    .eq('id', communityId);

  if (error) {
    console.error('[db] updateCommunityStats failed:', error);
    throw new Error(`Failed to update community stats: ${error.message}`);
  }
}
