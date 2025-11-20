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
  linkedAccounts: LinkedAccount[];
  avatar?: string;
  metrics: {
    views: number;
    shares: number;
    earnings?: number;
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
    avatar: row.avatar,
    otp: row.otp,
    otpExpires: row.otp_expires,
    linkedAccounts: row.linked_accounts?.map((acc: any) => ({
      platform: acc.platform,
      handle: acc.handle,
      id: acc.platform_user_id
    })) || [],
    metrics: {
      views: row.metrics?.[0]?.views || 0,
      shares: row.metrics?.[0]?.shares || 0,
      earnings: row.metrics?.[0]?.earnings || 0,
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
      avatar: user.avatar,
      otp: user.otp,
      otp_expires: user.otpExpires
    });

  if (userError) console.error('Error creating user:', userError);

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

  await supabase
    .from('linked_accounts')
    .delete()
    .eq('user_id', userId)
    .eq('platform', account.platform);

  await supabase
    .from('linked_accounts')
    .insert({
      user_id: userId,
      platform: account.platform,
      handle: account.handle,
      platform_user_id: account.id
    });
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
