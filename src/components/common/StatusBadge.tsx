import React from 'react';
import { ReviewStatus } from '../../types';
import { Loader2, CheckCircle, AlertOctagon, GitPullRequest, GitMerge } from 'lucide-react';

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
      bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      icon: Loader2,
      animate: true,
    },
    ai_completed: {
      label: 'AI Review Completed',
      bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      icon: GitPullRequest,
    },
    changes_requested: {
      label: 'Changes Requested',
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: AlertOctagon,
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      icon: CheckCircle,
    },
    merged: {
      label: 'Merged',
      bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      icon: GitMerge,
    },
  };

  const config = configs[status] || configs.ai_completed;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.animate ? 'animate-spin text-purple-400' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
