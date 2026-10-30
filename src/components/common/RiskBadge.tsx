import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<Props> = ({ 
  level, 
  score, 
  showIcon = true,
  size = 'md' 
}) => {
  const configs = {
    critical: {
      label: 'Critical Risk',
      bg: 'bg-[#A63232]/15 text-[#E06C75] border-[#A63232]/35',
      icon: ShieldAlert,
    },
    high: {
      label: 'High Risk',
      bg: 'bg-[#B7791F]/15 text-[#D4AF67] border-[#B7791F]/35',
      icon: AlertTriangle,
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30',
      icon: AlertCircle,
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-[#1D232C] text-[#96A0B0] border-[#2E3643]',
      icon: ShieldCheck,
    },
    safe: {
      label: 'Passed / Safe',
      bg: 'bg-[#2D6A4F]/15 text-[#4EAA78] border-[#2D6A4F]/35',
      icon: CheckCircle2,
    },
  };

  const config = configs[level] || configs.low;
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
      {showIcon && (
        <Icon className={size === 'lg' ? 'w-3.5 h-3.5 shrink-0' : 'w-3 h-3 shrink-0'} />
      )}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-80 font-mono ml-0.5">
          ({score}/100)
        </span>
      )}
    </span>
  );
};
