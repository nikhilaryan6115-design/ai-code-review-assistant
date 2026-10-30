import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SkullSVG } from '../halloween/SkullSVG';

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
      bg: 'bg-red-950/60 text-red-400 border-red-800/60',
      useSkull: true,
      icon: ShieldAlert,
    },
    high: {
      label: 'High Risk',
      bg: 'bg-pumpkin-dark/20 text-pumpkin border-pumpkin/30',
      useSkull: false,
      icon: AlertTriangle,
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-gold/10 text-gold border-gold/30',
      useSkull: false,
      icon: AlertCircle,
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-nocturne-charcoal text-nocturne-grey border-nocturne-border',
      useSkull: false,
      icon: ShieldCheck,
    },
    safe: {
      label: 'Passed / Safe',
      bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
      useSkull: false,
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

  const iconSize = size === 'lg' ? 14 : 12;

  return (
    <span 
      className={`inline-flex items-center rounded-md border font-medium tracking-tight ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && (
        config.useSkull
          ? <SkullSVG size={iconSize} color="#F87171" className="shrink-0" />
          : <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5 shrink-0'} />
      )}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-75 font-semibold ml-0.5">
          ({score}/100)
        </span>
      )}
    </span>
  );
};
