'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardDataResponse } from '@/app/api/dashboard/route';
import { RedeployResponse } from '@/app/api/portfolio/redeploy/route';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Globe,
  History,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Archive,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fetchDashboardData = async (): Promise<DashboardDataResponse> => {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch dashboard data');
  }
  return response.json();
};

const redeployPortfolio = async (historyEntryId: string): Promise<RedeployResponse> => {
  const response = await fetch('/api/portfolio/redeploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ historyEntryId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to redeploy portfolio');
  }
  return response.json();
};

// Status indicator
function StatusIndicator({ status }: { status: 'live' | 'archived' | 'building' }) {
  const colors = {
    live: 'bg-[#1a1a1a]',
    archived: 'bg-[#999]',
    building: 'bg-[#666]',
  };

  return (
    <span className={`flex h-2 w-2 ${colors[status]}`}>
      {status === 'live' && (
        <span className="animate-ping absolute inline-flex h-2 w-2 bg-[#1a1a1a] opacity-40" />
      )}
    </span>
  );
}

// Empty state
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#ccc] bg-white/50">
      <div className="w-10 h-10 bg-[#f0f0f0] flex items-center justify-center mb-4">
        <Icon className="h-4 w-4 text-[#666]" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-normal text-[#333] mb-1">{title}</h3>
      <p className="text-sm text-[#888] text-center max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [redeployingId, setRedeployingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  const redeployMutation = useMutation({
    mutationFn: redeployPortfolio,
    onSuccess: () => {
      toast.success('Portfolio redeployed successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['resume'] });
      setRedeployingId(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to redeploy portfolio');
      setRedeployingId(null);
    },
  });

  const handleRedeploy = (historyEntryId: string) => {
    setRedeployingId(historyEntryId);
    redeployMutation.mutate(historyEntryId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="h-6 w-32 bg-[#e5e5e5] mb-2" />
          <div className="h-4 w-64 bg-[#e5e5e5] mb-12" />
          <div className="h-24 w-full bg-[#e5e5e5] mb-6" />
          <div className="h-48 w-full bg-[#e5e5e5]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666] text-sm">
            Error loading dashboard: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const { history, livePortfolio, totalVersions } = data!;
  const archivedEntries = history.entries.filter((entry) => entry.status === 'archived');

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-2 block">
            Dashboard
          </span>
          <h1 className="text-3xl font-light tracking-tight">
            Your <span className="font-normal italic">deployments</span>
          </h1>
        </motion.div>

        {/* Stats Bar */}
        <div className="flex items-center gap-12 mb-12 pb-8 border-b border-[#e5e5e5]">
          <div>
            <p className="text-2xl font-light text-[#1a1a1a]">{totalVersions}</p>
            <p className="text-xs text-[#888] mt-1">Total versions</p>
          </div>
          <div>
            <p className="text-2xl font-light text-[#1a1a1a]">{archivedEntries.length}</p>
            <p className="text-xs text-[#888] mt-1">Archived</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusIndicator status={livePortfolio ? 'live' : 'archived'} />
              <span className="text-sm text-[#333]">
                {livePortfolio ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-[#888]">Current status</p>
          </div>
        </div>

        {/* Current Production */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#666]">
              Production
            </h2>
            {livePortfolio && (
              <Link href="/preview" className="text-xs text-[#666] hover:text-[#1a1a1a] flex items-center gap-1 transition-colors">
                View Current
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {livePortfolio ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#e5e5e5] p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] flex items-center justify-center">
                    <StatusIndicator status="live" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-normal">Portfolio v{livePortfolio.version}</span>
                      <span className="text-xs text-[#888]">•</span>
                      <span className="text-xs text-[#888]">
                        {formatDistanceToNow(livePortfolio.deployedAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-[#999]">
                      {format(livePortfolio.deployedAt, 'MMMM d, yyyy')} at {format(livePortfolio.deployedAt, 'h:mm a')}
                    </p>
                  </div>
                </div>
                <Link href="/preview">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-xs tracking-wide hover:bg-[#333] transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Open
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <EmptyState
              icon={Globe}
              title="No active deployment"
              description="Your portfolio isn't currently live. Publish from the preview page to deploy."
              action={
                <Link href="/preview">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-xs tracking-wide hover:bg-[#333] transition-colors">
                    <Rocket className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Deploy Portfolio
                  </button>
                </Link>
              }
            />
          )}
        </section>

        {/* Deployment History */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#666] mb-6">
            History
          </h2>

          {archivedEntries.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {archivedEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white border border-[#e5e5e5] hover:border-[#ccc] transition-colors"
                  >
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#f5f5f5] flex items-center justify-center">
                          <Archive className="h-4 w-4 text-[#666]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-normal">Portfolio v{entry.version}</span>
                            <span className="text-xs px-2 py-0.5 bg-[#f0f0f0] text-[#666]">Archived</span>
                          </div>
                          <p className="text-xs text-[#999]">
                            {format(entry.deployedAt, 'MMMM d, yyyy')} • {formatDistanceToNow(entry.deployedAt, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRedeploy(entry.id)}
                        disabled={redeployingId === entry.id}
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-2 px-3 py-2 border border-[#1a1a1a] text-[#1a1a1a] text-xs hover:bg-[#1a1a1a] hover:text-white transition-all disabled:opacity-50"
                      >
                        {redeployingId === entry.id ? (
                          <>
                            <div className="h-3 w-3 animate-spin border border-current border-t-transparent" />
                            <span>Redeploying...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
                            <span>Redeploy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No history yet"
              description="Previous versions will appear here when you publish updates."
            />
          )}
        </section>
      </div>
    </div>
  );
}
