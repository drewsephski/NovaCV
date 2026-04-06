import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { redeployPortfolio } from '@/lib/server/redisActions';

export interface RedeployRequest {
  historyEntryId: string;
}

export interface RedeployResponse {
  success: boolean;
  message?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<RedeployResponse | { error: string }>> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RedeployRequest = await request.json();
    const { historyEntryId } = body;

    if (!historyEntryId) {
      return NextResponse.json(
        { error: 'History entry ID is required' },
        { status: 400 }
      );
    }

    const success = await redeployPortfolio(user.id, historyEntryId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to redeploy portfolio' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio redeployed successfully',
    });
  } catch (error) {
    console.error('Error redeploying portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to redeploy portfolio' },
      { status: 500 }
    );
  }
}
