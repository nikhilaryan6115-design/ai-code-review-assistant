import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  change,
  isPositive,
  subtitle,
  icon: Icon,
  badge
}) => {
  return (
    <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 hover:border-pumpkin/30 transition-all duration-150 shadow-card hover:shadow-card-hover group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-nocturne-grey uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-nocturne-charcoal border border-nocturne-border flex items-center justify-center text-nocturne-grey group-hover:text-pumpkin transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-nocturne-ivory font-heading">
          {value}
        </span>
        {badge && (
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-nocturne-charcoal border border-nocturne-border text-nocturne-grey">
            {badge}
          </span>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-nocturne-border flex items-center justify-between text-xs font-mono">
          {change && (
            <span
              className={`inline-flex items-center font-medium ${
                isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
              )}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-nocturne-grey truncate text-[11px] ml-auto">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
