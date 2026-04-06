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
  Activity,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem, DotGrid, CornerAccent } from '@/components/motion';

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

// Status indicator with animation
function StatusIndicator({ status }: { status: 'live' | 'archived' | 'building' }) {
  const colors = {
    live: 'bg-emerald-500',
    archived: 'bg-[#999]',
    building: 'bg-amber-500',
  };

  return (
    <span className={`flex h-2.5 w-2.5 ${colors[status]} rounded-full relative`}>
      {status === 'live' && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
      )}
      {status === 'building' && (
        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40" />
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#ccc] bg-white/50"
    >
      <motion.div
        className="w-12 h-12 bg-[#f5f5f5] flex items-center justify-center mb-4"
        transition={{ duration: 0.2 }}
      >
        <Icon className="h-5 w-5 text-[#666]" strokeWidth={1.5} />
      </motion.div>
      <h3 className="text-sm font-normal text-[#333] mb-1">{title}</h3>
      <p className="text-sm text-[#888] text-center max-w-xs mb-4">{description}</p>
      {action}
    </motion.div>
  );
}

// Stat card component
function StatCard({
  value,
  label,
  icon: Icon,
  trend,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <motion.div
      className="bg-white border border-[#e5e5e5] p-5 group hover:border-[#ccc] transition-all duration-300"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className="h-4 w-4 text-[#999] group-hover:text-[#666] transition-colors" strokeWidth={1.5} />
        {trend && <span className="text-xs text-emerald-600">{trend}</span>}
      </div>
      <p className="text-2xl font-light text-[#1a1a1a]">{value}</p>
      <p className="text-xs text-[#888] mt-1">{label}</p>
    </motion.div>
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
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-[#e5e5e5] mb-2" />
            <div className="h-4 w-64 bg-[#e5e5e5] mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="h-24 bg-[#e5e5e5]" />
              <div className="h-24 bg-[#e5e5e5]" />
              <div className="h-24 bg-[#e5e5e5]" />
            </div>
            <div className="h-48 w-full bg-[#e5e5e5]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4">
            <Activity className="h-6 w-6 text-[#999]" strokeWidth={1.5} />
          </div>
          <p className="text-[#666] text-sm mb-2">
            Error loading dashboard
          </p>
          <p className="text-[#999] text-xs">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </motion.div>
      </div>
    );
  }

  const { history, livePortfolio, totalVersions } = data!;
  const archivedEntries = history.entries.filter((entry) => entry.status === 'archived');

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a] overflow-x-hidden">
      {/* Decorative element */}
      <div className="absolute top-32 right-8 opacity-20 hidden lg:block">
        <DotGrid rows={6} cols={4} gap={20} dotSize={2} />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16 relative">
        <CornerAccent position="top-right" size={40} className="top-8 right-8" />

        {/* Header */}
        <ScrollReveal className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-2 block">
              Dashboard
            </span>
            <h1 className="text-3xl font-light tracking-tight">
              Your <span className="font-normal italic">deployments</span>
            </h1>
          </motion.div>
        </ScrollReveal>

        {/* Stats Grid */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <StatCard
              value={totalVersions}
              label="Total versions"
              icon={Layers}
            />
            <StatCard
              value={archivedEntries.length}
              label="Archived"
              icon={Archive}
            />
            <StatCard
              value={livePortfolio ? 'Active' : 'Inactive'}
              label="Current status"
              icon={Activity}
              trend={livePortfolio ? 'Live' : undefined}
            />
          </div>
        </ScrollReveal>

        {/* Current Production */}
        <ScrollReveal delay={0.2}>
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs uppercase tracking-[0.2em] text-[#666] flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                Production
              </h2>
              {livePortfolio && (
                <Link href="/preview">
                  <motion.span
                    className="text-xs text-[#666] hover:text-[#1a1a1a] flex items-center gap-1 transition-colors cursor-pointer"
                    whileHover={{ x: 2 }}
                  >
                    View Current
                    <ChevronRight className="h-3 w-3" />
                  </motion.span>
                </Link>
              )}
            </div>

            {livePortfolio ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#e5e5e5] p-6 group hover:border-[#ccc] transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center">
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
                    <motion.button
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-xs tracking-wide hover:bg-[#333] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Open
                    </motion.button>
                  </Link>
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#f0f0f0]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#999]" strokeWidth={1.5} />
                    <span className="text-xs text-[#666]">Deployed {formatDistanceToNow(livePortfolio.deployedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.5} />
                    <span className="text-xs text-[#666]">Live and accessible</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <EmptyState
                icon={Globe}
                title="No active deployment"
                description="Your portfolio isn't currently live. Publish from the preview page to deploy."
                action={
                  <Link href="/preview">
                    <motion.button
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-xs tracking-wide hover:bg-[#333] transition-colors"
                    >
                      <Rocket className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Deploy Portfolio
                    </motion.button>
                  </Link>
                }
              />
            )}
          </section>
        </ScrollReveal>

        {/* Deployment History */}
        <ScrollReveal delay={0.3}>
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#666] mb-6 flex items-center gap-2">
              <History className="h-3.5 w-3.5" strokeWidth={1.5} />
              History
            </h2>

            {archivedEntries.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {archivedEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group bg-white border border-[#e5e5e5] hover:border-[#ccc] transition-all duration-300"
                    >
                      <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#f5f5f5] flex items-center justify-center group-hover:bg-[#f0f0f0] transition-colors">
                            <Archive className="h-5 w-5 text-[#666]" strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-normal">Portfolio v{entry.version}</span>
                              <span className="text-xs px-2 py-0.5 bg-[#f5f5f5] text-[#666] group-hover:bg-[#f0f0f0] transition-colors">Archived</span>
                            </div>
                            <p className="text-xs text-[#999]">
                              {format(entry.deployedAt, 'MMMM d, yyyy')} • {formatDistanceToNow(entry.deployedAt, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleRedeploy(entry.id)}
                          disabled={redeployingId === entry.id}
                          className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-2 px-3 py-2 border border-[#1a1a1a] text-[#1a1a1a] text-xs hover:bg-[#1a1a1a] hover:text-white transition-all disabled:opacity-50"
                        >
                          {redeployingId === entry.id ? (
                            <>
                              <div className="h-3 w-3 animate-spin border border-current border-t-transparent rounded-full" />
                              <span>Redeploying...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
                              <span>Redeploy</span>
                            </>
                          )}
                        </motion.button>
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
        </ScrollReveal>
      </div>
    </div>
  );
}
