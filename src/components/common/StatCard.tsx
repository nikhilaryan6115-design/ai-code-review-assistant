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
    <div className="bg-ivf-surface border border-ivf-border rounded-lg p-5 hover:border-ivf-border/80 transition-colors shadow-[0_1px_4px_var(--color-shadow)] group">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-ivf-sec font-medium">{title}</span>
        <div className="w-7 h-7 rounded-lg bg-ivf-bgAlt border border-ivf-border flex items-center justify-center text-ivf-sec group-hover:text-ivf-accent transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-ivf-pri">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-ivf-bgAlt border border-ivf-border text-ivf-sec">
            {badge}
          </span>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-ivf-border flex items-center justify-between text-xs font-mono">
          {change && (
            <span
              className={`inline-flex items-center font-medium ${
                isPositive ? 'text-ivf-green' : 'text-ivf-red'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-ivf-sec truncate text-[11px] ml-auto">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
