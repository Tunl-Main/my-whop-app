import { whopsdk } from "./whop-sdk";

export interface ExperienceDetails {
  id: string;
  name: string;
  iconUrl: string | null;
  companyId: string | null;
}

export interface ExperienceMemberCount {
  totalCount: number;
}

/**
 * Fetches experience details (name, icon) from Whop API
 * Hard-fails with detailed logging on error - no fallbacks
 */
export async function getExperienceDetails(experienceId: string): Promise<ExperienceDetails> {
  if (!experienceId) {
    const error = new Error("[whop-experience] experienceId is required");
    console.error("[whop-experience] getExperienceDetails failed:", {
      error: error.message,
      experienceId,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }

  try {
    const experience = await whopsdk.experiences.retrieve(experienceId);
    
    // Extract icon URL from app if available
    let iconUrl: string | null = null;
    if (experience.app && typeof experience.app === 'object') {
      const app = experience.app as any;
      if (app.icon && typeof app.icon === 'object' && app.icon.url) {
        iconUrl = app.icon.url;
      } else if (app.icon && typeof app.icon === 'string') {
        iconUrl = app.icon;
      }
    }

    return {
      id: experience.id,
      name: experience.name || `Experience ${experienceId}`,
      iconUrl,
      companyId: (experience as any).company_id || (experience as any).company || null,
    };
  } catch (err: any) {
    console.error("[whop-experience] getExperienceDetails failed:", {
      error: err.message,
      experienceId,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`[whop-experience] Failed to fetch experience details: ${err.message}`);
  }
}

/**
 * Fetches total member count for an experience from Whop API
 * Note: This endpoint may not be available in all SDK versions
 * Returns 0 if the endpoint is not available
 */
export async function getExperienceMemberCount(experienceId: string): Promise<ExperienceMemberCount> {
  if (!experienceId) {
    const error = new Error("[whop-experience] experienceId is required");
    console.error("[whop-experience] getExperienceMemberCount failed:", {
      error: error.message,
      experienceId,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }

  try {
    // Try to get member count via the experiences API
    // Note: listUsersForExperience may not be available in all SDK versions
    const experiences = whopsdk.experiences as any;
    if (typeof experiences.listUsersForExperience === 'function') {
      const result = await experiences.listUsersForExperience(experienceId, {
        per_page: 1,
      });
      return {
        totalCount: result.pagination?.total_count || 0,
      };
    }
    
    // If the method doesn't exist, return 0
    console.warn("[whop-experience] listUsersForExperience not available in SDK");
    return { totalCount: 0 };
  } catch (err: any) {
    console.error("[whop-experience] getExperienceMemberCount failed:", {
      error: err.message,
      experienceId,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
    // Return 0 instead of throwing to avoid breaking the app
    return { totalCount: 0 };
  }
}

/**
 * Fetches both experience details and member count
 * Convenience function for getting all community info at once
 */
export async function getFullExperienceInfo(experienceId: string): Promise<ExperienceDetails & ExperienceMemberCount> {
  const [details, memberCount] = await Promise.all([
    getExperienceDetails(experienceId),
    getExperienceMemberCount(experienceId),
  ]);

  return {
    ...details,
    ...memberCount,
  };
}

