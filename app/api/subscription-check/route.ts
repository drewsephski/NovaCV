import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getSubscription, hasActiveSubscription } from '@/lib/server/redisActions';

export interface SubscriptionCheckResponse {
  hasSubscription: boolean;
  subscription?: {
    status: string;
    currentPeriodEnd?: number;
    cancelAtPeriodEnd?: boolean;
  } | null;
}

export async function GET(): Promise<NextResponse<SubscriptionCheckResponse | { error: string }>> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasSubscription = await hasActiveSubscription(user.id);
    const subscription = await getSubscription(user.id);

    return NextResponse.json({
      hasSubscription,
      subscription: subscription
        ? {
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
