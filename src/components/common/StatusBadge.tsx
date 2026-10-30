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
      bg: 'bg-[#1A2332] text-[#C5A059] border-[#2E3643]',
      icon: Loader2,
      animate: true,
    },
    ai_completed: {
      label: 'Analysis Ready',
      bg: 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30',
      icon: GitPullRequest,
    },
    changes_requested: {
      label: 'Changes Requested',
      bg: 'bg-[#B7791F]/15 text-[#D4AF67] border-[#B7791F]/35',
      icon: AlertOctagon,
    },
    approved: {
      label: 'Approved',
      bg: 'bg-[#2D6A4F]/15 text-[#4EAA78] border-[#2D6A4F]/35',
      icon: CheckCircle2,
    },
    merged: {
      label: 'Merged',
      bg: 'bg-[#1D232C] text-[#96A0B0] border-[#2E3643]',
      icon: GitMerge,
    },
  };

  const config = configs[status] || configs.ai_completed;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono uppercase tracking-wider',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-mono tracking-wide',
    lg: 'text-xs px-3 py-1 gap-2 font-medium font-sans',
  };

  return (
    <span
      className={`inline-flex items-center rounded border font-medium ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={`w-3 h-3 shrink-0 ${config.animate ? 'animate-spin text-[#C5A059]' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
