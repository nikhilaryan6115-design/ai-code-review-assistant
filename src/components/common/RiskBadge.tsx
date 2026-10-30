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
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-500',
      icon: ShieldAlert,
    },
    high: {
      label: 'High Risk',
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-500',
      icon: AlertTriangle,
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500',
      icon: AlertCircle,
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400',
      icon: ShieldCheck,
    },
    safe: {
      label: 'Passed / Safe',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      icon: CheckCircle2,
    },
  };

  const config = configs[level] || configs.low;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border font-mono tracking-wide ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span className="capitalize">{config.label}</span>
      {score !== undefined && (
        <span className="opacity-75 font-semibold">
          ({score}/100)
        </span>
      )}
    </span>
  );
};
