import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { deletePortfolioHistoryEntry } from '@/lib/server/redisActions';

export interface DeleteRequest {
  historyEntryId: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<DeleteResponse | { error: string }>> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: DeleteRequest = await request.json();
    const { historyEntryId } = body;

    if (!historyEntryId) {
      return NextResponse.json(
        { error: 'History entry ID is required' },
        { status: 400 }
      );
    }

    const success = await deletePortfolioHistoryEntry(user.id, historyEntryId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete portfolio history entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio history entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting portfolio history entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio history entry' },
      { status: 500 }
    );
  }
}
