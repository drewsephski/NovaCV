import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import {
  getPortfolioHistory,
  getLivePortfolioFromHistory,
  PortfolioHistory,
} from '@/lib/server/redisActions';

export interface DashboardDataResponse {
  history: PortfolioHistory;
  livePortfolio: {
    id: string;
    deployedAt: number;
    version: number;
  } | null;
  totalVersions: number;
}

export async function GET(): Promise<
  NextResponse<DashboardDataResponse | { error: string }>
> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [history, livePortfolio] = await Promise.all([
      getPortfolioHistory(user.id),
      getLivePortfolioFromHistory(user.id),
    ]);

    return NextResponse.json({
      history,
      livePortfolio: livePortfolio
        ? {
            id: livePortfolio.id,
            deployedAt: livePortfolio.deployedAt,
            version: livePortfolio.version,
          }
        : null,
      totalVersions: history.totalVersions,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
