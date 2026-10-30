import React from 'react';
import { ReviewStatus } from '../../types';
import { Loader2, CheckCircle2, AlertOctagon, GitPullRequest, GitMerge } from 'lucide-react';

interface Props {
  status: ReviewStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const configs: Record<ReviewStatus, {
    label: string;
    bg: string;
    icon: React.ElementType;
    animate?: boolean;
  }> = {
    ai_reviewing: {
      label: 'AI Reviewing...',
      bg: 'bg-wine-50 text-wine-800 border-wine-200',
      icon: Loader2,
      animate: true,
    },
    ai_completed: {
      label: 'AI Analysis Ready',
      bg: 'bg-buttercream-100 text-tobacco-800 border-buttercream-300',
      icon: GitPullRequest,
    },
    changes_requested: {
      label: 'Changes Requested',
      bg: 'bg-amber-50 text-amber-900 border-amber-300/80',
      icon: AlertOctagon,
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
      icon: CheckCircle2,
    },
    merged: {
      label: 'Merged',
      bg: 'bg-warm-subtle text-warm-charcoal border-warm-borderStrong',
      icon: GitMerge,
    },
  };

  const config = configs[status] || configs.ai_completed;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium tracking-tight ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${config.animate ? 'animate-spin text-wine-700' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
