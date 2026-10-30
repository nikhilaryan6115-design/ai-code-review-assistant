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
    <div className="bg-[#161B22] border border-[#2E3643] rounded p-5 hover:border-[#3E495B] transition-colors shadow-sm group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#96A0B0]">{title}</span>
        <div className="w-7 h-7 rounded bg-[#1D232C] border border-[#2E3643] flex items-center justify-center text-[#96A0B0] group-hover:text-[#C5A059] transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-[#F2F4F8]">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#1D232C] border border-[#2E3643] text-[#96A0B0] uppercase tracking-wide">
            {badge}
          </span>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-[#2E3643] flex items-center justify-between text-xs font-mono">
          {change && (
            <span
              className={`inline-flex items-center font-medium ${
                isPositive ? 'text-[#2D6A4F]' : 'text-[#A63232]'
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
            <span className="text-[#96A0B0] truncate text-[11px] ml-auto">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
