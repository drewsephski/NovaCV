import { upstashRedis } from '@/lib/server/redis';
import { ResumeDataSchema } from '@/lib/resume';
import { z } from 'zod';
import { PRIVATE_ROUTES } from '../routes';

// Key prefixes for different types of data
const REDIS_KEYS = {
  RESUME_PREFIX: 'resume:', // Using colon is a Redis convention for namespacing
  USER_ID_PREFIX: 'user:id:',
  USER_NAME_PREFIX: 'user:name:',
  SUBSCRIPTION_PREFIX: 'subscription:',
  PORTFOLIO_HISTORY_PREFIX: 'portfolio:history:',
} as const;

// Define the file schema
const FileSchema = z.object({
  name: z.string(),
  url: z.string().nullish(),
  size: z.number(),
  bucket: z.string().optional(),
  key: z.string(),
});

const FORBIDDEN_USERNAMES = PRIVATE_ROUTES;

// Define the complete resume schema
const ResumeSchema = z.object({
  status: z.enum(['live', 'draft']).default('draft'),
  file: FileSchema.nullish(),
  fileContent: z.string().nullish(),
  resumeData: ResumeDataSchema.nullish(),
});

// Type inference for the resume data
export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type Resume = z.infer<typeof ResumeSchema>;

// Function to get resume data for a user
export async function getResume(userId: string): Promise<Resume | undefined> {
  try {
    const resume = await upstashRedis.get<Resume>(
      `${REDIS_KEYS.RESUME_PREFIX}${userId}`,
    );
    return resume || undefined;
  } catch (error) {
    console.error('Error retrieving resume:', error);
    throw new Error('Failed to retrieve resume');
  }
}

// Function to store resume data for a user
export async function storeResume(
  userId: string,
  resumeData: Resume,
): Promise<void> {
  try {
    const validatedData = ResumeSchema.parse(resumeData);
    await upstashRedis.set(
      `${REDIS_KEYS.RESUME_PREFIX}${userId}`,
      validatedData,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error;
    }
    console.error('Error storing resume:', error);
    throw new Error('Failed to store resume');
  }
}

/**
 * Create a new user with bidirectional lookup
 * @param userId Unique user identifier
 * @param username Unique username
 * @returns Promise resolving to boolean indicating success
 */
export const createUsernameLookup = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}): Promise<boolean> => {
  // Check if username is forbidden
  if (FORBIDDEN_USERNAMES.includes(username.toLowerCase())) {
    return false;
  }

  // Check if username or user_id already exists
  const [usernameExists, userIdExists] = await Promise.all([
    upstashRedis.exists(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`),
    upstashRedis.exists(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`),
  ]);

  if (usernameExists || userIdExists) {
    return false;
  }

  // Create mappings in both directions
  const transaction = upstashRedis.multi();
  transaction.set(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`, username);
  transaction.set(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`, userId);

  try {
    const results = await transaction.exec();
    return results.every((result) => result === 'OK');
  } catch (error) {
    console.error('User creation failed:', error);
    return false;
  }
};

/**
 * Retrieve username by user ID
 * @param userId User ID to look up
 * @returns Promise resolving to username or null
 */
export const getUsernameById = async (
  userId: string,
): Promise<string | null> => {
  return await upstashRedis.get(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`);
};

/**
 * Retrieve user ID by username
 * @param username Username to look up
 * @returns Promise resolving to user ID or null
 */
export const getUserIdByUsername = async (
  username: string,
): Promise<string | null> => {
  return await upstashRedis.get(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`);
};

export const checkUsernameAvailability = async (
  username: string,
): Promise<{
  available: boolean;
}> => {
  if (FORBIDDEN_USERNAMES.includes(username.toLowerCase())) {
    return { available: false };
  }
  const userId = await getUserIdByUsername(username);
  return { available: !userId };
};

/**
 * Delete a user by either user ID or username
 * @param opts Object containing either userId or username
 * @returns Promise resolving to boolean indicating success
 */
export const deleteUser = async (opts: {
  userId?: string;
  username?: string;
}): Promise<boolean> => {
  let userId: string | null = null;
  let username: string | null = null;

  // Determine lookup method based on input
  if (opts.userId) {
    username = await getUsernameById(opts.userId);
    if (!username) return false;
  } else if (opts.username) {
    userId = await getUserIdByUsername(opts.username);
    if (!userId) return false;
  } else {
    return false;
  }

  // Use the found values if not provided
  userId = userId || opts.userId!;
  username = username || opts.username!;

  // Delete both mappings
  const transaction = upstashRedis.multi();
  transaction.del(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`);
  transaction.del(`${REDIS_KEYS.USER_NAME_PREFIX}${username}`);

  try {
    const results = await transaction.exec();
    return results.every((result) => result === 1);
  } catch (error) {
    console.error('User deletion failed:', error);
    return false;
  }
};

/**
 * Update username for a given user ID
 * @param userId User ID to update
 * @param newUsername New username
 * @returns Promise resolving to boolean indicating success
 */
export const updateUsername = async (
  userId: string,
  newUsername: string,
): Promise<boolean> => {
  // Check if new username is forbidden
  if (FORBIDDEN_USERNAMES.includes(newUsername.toLowerCase())) {
    return false;
  }

  // Get current username
  const currentUsername = await getUsernameById(userId);
  if (!currentUsername) return false;

  // Check if new username is already taken
  const newUsernameExists = await upstashRedis.exists(
    `${REDIS_KEYS.USER_NAME_PREFIX}${newUsername}`,
  );
  if (newUsernameExists) return false;

  // Create transaction to update mappings
  const transaction = upstashRedis.multi();
  transaction.del(`${REDIS_KEYS.USER_NAME_PREFIX}${currentUsername}`);
  transaction.set(`${REDIS_KEYS.USER_ID_PREFIX}${userId}`, newUsername);
  transaction.set(`${REDIS_KEYS.USER_NAME_PREFIX}${newUsername}`, userId);

  try {
    const results = await transaction.exec();
    return results.every((result) => result === 'OK' || result === 1);
  } catch (error) {
    console.error('Username update failed:', error);
    return false;
  }
};

// Subscription Types
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid';

export interface SubscriptionData {
  status: SubscriptionStatus;
  customerId?: string;
  subscriptionId?: string;
  sessionId?: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
  lastPaymentStatus?: 'succeeded' | 'failed';
  lastPaymentDate?: number;
  canceledAt?: number;
  updatedAt: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Get subscription data for a user
 * @param userId User ID to look up
 * @returns Promise resolving to subscription data or null
 */
export const getSubscription = async (
  userId: string,
): Promise<SubscriptionData | null> => {
  try {
    const subscription = await upstashRedis.hgetall<SubscriptionData>(
      `${REDIS_KEYS.SUBSCRIPTION_PREFIX}${userId}`,
    );
    return subscription || null;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return null;
  }
};

/**
 * Check if user has an active subscription
 * @param userId User ID to check
 * @returns Promise resolving to boolean indicating active subscription
 */
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  const subscription = await getSubscription(userId);
  if (!subscription) return false;
  
  // Consider subscription active if status is active or trialing
  // and not set to cancel at period end
  return (
    (subscription.status === 'active' || subscription.status === 'trialing') &&
    !subscription.cancelAtPeriodEnd
  );
};

/**
 * Store subscription data for a user
 * @param userId User ID
 * @param data Subscription data to store
 * @returns Promise resolving to boolean indicating success
 */
export const storeSubscription = async (
  userId: string,
  data: Partial<SubscriptionData>,
): Promise<boolean> => {
  try {
    await upstashRedis.hset(`${REDIS_KEYS.SUBSCRIPTION_PREFIX}${userId}`, {
      ...data,
      updatedAt: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error storing subscription:', error);
    return false;
  }
};

/**
 * Delete subscription data for a user
 * @param userId User ID
 * @returns Promise resolving to boolean indicating success
 */
export const deleteSubscription = async (userId: string): Promise<boolean> => {
  try {
    await upstashRedis.del(`${REDIS_KEYS.SUBSCRIPTION_PREFIX}${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return false;
  }
};

// Portfolio History Types
export interface PortfolioHistoryEntry {
  id: string;
  deployedAt: number;
  status: 'live' | 'archived';
  resumeData: ResumeData | null;
  file: Resume['file'];
  version: number;
}

export interface PortfolioHistory {
  entries: PortfolioHistoryEntry[];
  totalVersions: number;
}

/**
 * Add a portfolio version to history when deployed
 * @param userId User ID
 * @param resume The resume data being deployed
 * @returns Promise resolving to the history entry ID
 */
export const addPortfolioToHistory = async (
  userId: string,
  resume: Resume,
): Promise<string | null> => {
  try {
    const historyKey = `${REDIS_KEYS.PORTFOLIO_HISTORY_PREFIX}${userId}`;
    const history = await getPortfolioHistory(userId);

    // Archive any currently live entries
    const updatedEntries = history.entries.map((entry) => ({
      ...entry,
      status: 'archived' as const,
    }));

    // Create new history entry
    const version = history.totalVersions + 1;
    const entryId = `${userId}_v${version}_${Date.now()}`;
    const newEntry: PortfolioHistoryEntry = {
      id: entryId,
      deployedAt: Date.now(),
      status: 'live',
      resumeData: resume.resumeData || null,
      file: resume.file,
      version,
    };

    // Keep only last 20 versions (arbitrary limit for storage efficiency)
    const trimmedEntries = [newEntry, ...updatedEntries].slice(0, 20);

    await upstashRedis.set(historyKey, {
      entries: trimmedEntries,
      totalVersions: version,
    });

    return entryId;
  } catch (error) {
    console.error('Error adding portfolio to history:', error);
    return null;
  }
};

/**
 * Get portfolio history for a user
 * @param userId User ID
 * @returns Promise resolving to portfolio history
 */
export const getPortfolioHistory = async (
  userId: string,
): Promise<PortfolioHistory> => {
  try {
    const historyKey = `${REDIS_KEYS.PORTFOLIO_HISTORY_PREFIX}${userId}`;
    const history = await upstashRedis.get<PortfolioHistory>(historyKey);
    return history || { entries: [], totalVersions: 0 };
  } catch (error) {
    console.error('Error retrieving portfolio history:', error);
    return { entries: [], totalVersions: 0 };
  }
};

/**
 * Redeploy a portfolio from history
 * @param userId User ID
 * @param historyEntryId The history entry ID to redeploy
 * @returns Promise resolving to boolean indicating success
 */
export const redeployPortfolio = async (
  userId: string,
  historyEntryId: string,
): Promise<boolean> => {
  try {
    const history = await getPortfolioHistory(userId);
    const entry = history.entries.find((e) => e.id === historyEntryId);

    if (!entry) {
      console.error('History entry not found:', historyEntryId);
      return false;
    }

    // Get current resume to preserve non-history fields
    const currentResume = await getResume(userId);

    // Create the redeployed resume
    const redeployedResume: Resume = {
      status: 'live',
      file: entry.file,
      fileContent: currentResume?.fileContent,
      resumeData: entry.resumeData,
    };

    // Store the redeployed resume
    await storeResume(userId, redeployedResume);

    // Add this redeployment to history
    await addPortfolioToHistory(userId, redeployedResume);

    return true;
  } catch (error) {
    console.error('Error redeploying portfolio:', error);
    return false;
  }
};

/**
 * Get currently live portfolio from history
 * @param userId User ID
 * @returns Promise resolving to live history entry or null
 */
export const getLivePortfolioFromHistory = async (
  userId: string,
): Promise<PortfolioHistoryEntry | null> => {
  try {
    const history = await getPortfolioHistory(userId);
    return history.entries.find((entry) => entry.status === 'live') || null;
  } catch (error) {
    console.error('Error getting live portfolio:', error);
    return null;
  }
};

/**
 * Delete a portfolio history entry
 * @param userId User ID
 * @param historyEntryId The history entry ID to delete
 * @returns Promise resolving to boolean indicating success
 */
export const deletePortfolioHistoryEntry = async (
  userId: string,
  historyEntryId: string,
): Promise<boolean> => {
  try {
    const historyKey = `${REDIS_KEYS.PORTFOLIO_HISTORY_PREFIX}${userId}`;
    const history = await getPortfolioHistory(userId);

    // Find the entry being deleted to check if it's live
    const entryToDelete = history.entries.find((entry) => entry.id === historyEntryId);
    
    if (!entryToDelete) {
      console.error('History entry not found:', historyEntryId);
      return false;
    }

    // Filter out the entry to delete
    const updatedEntries = history.entries.filter((entry) => entry.id !== historyEntryId);

    // Update history with remaining entries
    await upstashRedis.set(historyKey, {
      entries: updatedEntries,
      totalVersions: history.totalVersions,
    });

    // If the deleted entry was live, also unpublish the resume
    if (entryToDelete.status === 'live') {
      const currentResume = await getResume(userId);
      if (currentResume) {
        await storeResume(userId, {
          ...currentResume,
          status: 'draft',
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting portfolio history entry:', error);
    return false;
  }
};
