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
      bg: 'bg-red-50 text-ivf-red border-red-200',
      icon: ShieldAlert,
    },
    high: {
      label: 'High Risk',
      bg: 'bg-amber-50 text-ivf-amber border-amber-200',
      icon: AlertTriangle,
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-amber-50/60 text-ivf-amber border-amber-100',
      icon: AlertCircle,
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-ivf-bgAlt text-ivf-sec border-ivf-border',
      icon: ShieldCheck,
    },
    safe: {
      label: 'Passed / Safe',
      bg: 'bg-green-50 text-ivf-green border-green-200',
      icon: CheckCircle2,
    },
  };

  const config = configs[level] || configs.low;
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
