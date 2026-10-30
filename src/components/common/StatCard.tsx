import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  change,
  isPositive,
  subtitle,
  icon: Icon,
  iconColor = 'text-brand-blue',
  iconBg = 'bg-brand-blue/10 border-brand-blue/20',
}) => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-dark-borderLight transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-dark-muted tracking-tight">{title}</span>
        <div className={`p-2.5 rounded-lg border ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold font-mono text-dark-text tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-medium ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
            )}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-dark-dim truncate">{subtitle}</p>
      )}
    </div>
  );
};
