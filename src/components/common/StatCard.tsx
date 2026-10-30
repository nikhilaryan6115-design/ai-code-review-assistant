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
    <div className="bg-warm-white border border-warm-border rounded-xl p-5 hover:border-warm-borderStrong transition-all duration-150 shadow-warm-sm group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-warm-muted uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-warm-subtle/80 border border-warm-border/60 flex items-center justify-center text-tobacco group-hover:text-wine-700 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-warm-charcoal font-sans">
          {value}
        </span>
        {badge && (
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-buttercream/60 border border-warm-border text-tobacco-700">
            {badge}
          </span>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 pt-2.5 border-t border-warm-border/40 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`inline-flex items-center font-medium ${
                isPositive ? 'text-emerald-700' : 'text-red-700'
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
            <span className="text-warm-muted truncate text-[11px] ml-auto">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
