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
      label: 'AI Pre-screening...',
      bg: 'bg-ivf-bgAlt text-ivf-amber border-amber-200',
      icon: Loader2,
      animate: true,
    },
    ai_completed: {
      label: 'Analysis Ready',
      bg: 'bg-amber-50 text-ivf-amber border-amber-200',
      icon: GitPullRequest,
    },
    changes_requested: {
      label: 'Changes Requested',
      bg: 'bg-amber-50 text-ivf-amber border-amber-200',
      icon: AlertOctagon,
    },
    approved: {
      label: 'Approved',
      bg: 'bg-green-50 text-ivf-green border-green-200',
      icon: CheckCircle2,
    },
    merged: {
      label: 'Merged',
      bg: 'bg-ivf-bgAlt text-ivf-sec border-ivf-border',
      icon: GitMerge,
    },
  };

  const config = configs[status] || configs.ai_completed;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-mono',
    lg: 'text-xs px-3 py-1 gap-2 font-medium font-sans',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={`w-3 h-3 shrink-0 ${config.animate ? 'animate-spin text-ivf-amber' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
