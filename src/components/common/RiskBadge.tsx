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
      bg: 'bg-red-50 text-red-800 border-red-200/80',
      icon: ShieldAlert,
    },
    high: {
      label: 'High Risk',
      bg: 'bg-amber-50 text-amber-900 border-amber-300/80',
      icon: AlertTriangle,
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-tobacco-50 text-tobacco-800 border-tobacco-200',
      icon: AlertCircle,
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-warm-subtle text-warm-charcoal border-warm-border',
      icon: ShieldCheck,
    },
    safe: {
      label: 'Passed / Safe',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      icon: CheckCircle2,
    },
  };

  const config = configs[level] || configs.low;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-mono',
    lg: 'text-xs px-3 py-1.5 gap-2 font-medium font-sans',
  };

  return (
    <span 
      className={`inline-flex items-center rounded-md border font-medium tracking-tight ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5 shrink-0'} />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-75 font-semibold ml-0.5">
          ({score}/100)
        </span>
      )}
    </span>
  );
};
