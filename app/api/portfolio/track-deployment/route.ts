import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { addPortfolioToHistory, getResume } from '@/lib/server/redisActions';

export interface TrackDeploymentRequest {
  timestamp?: number;
}

export interface TrackDeploymentResponse {
  success: boolean;
  historyEntryId?: string;
  message?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<TrackDeploymentResponse | { error: string }>> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await getResume(user.id);

    if (!resume) {
      return NextResponse.json(
        { error: 'No resume found for user' },
        { status: 404 }
      );
    }

    const historyEntryId = await addPortfolioToHistory(user.id, resume);

    if (!historyEntryId) {
      return NextResponse.json(
        { error: 'Failed to track deployment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      historyEntryId,
      message: 'Deployment tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking deployment:', error);
    return NextResponse.json(
      { error: 'Failed to track deployment' },
      { status: 500 }
    );
  }
}
