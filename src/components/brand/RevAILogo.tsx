import React from 'react';

export interface RevAILogoProps {
  /**
   * Layout format:
   * - 'full': Monogram + 3 Dots + Wordmark (default)
   * - 'monogram': Standalone R monogram only (for favicon, app icon, compact UI)
   * - 'stacked': Monogram top, dots middle, wordmark bottom (for loading/hero screens)
   * - 'wordmark': 3 Dots + Wordmark without monogram
   */
  layout?: 'full' | 'monogram' | 'stacked' | 'wordmark';
  /**
   * Color theme:
   * - 'light': Optimized for light backgrounds (#F5F3ED / #FFFFFF)
   * - 'dark': Optimized for dark backgrounds (#24342E / #161B22)
   * - 'auto': Uses current text/theme context
   */
  theme?: 'light' | 'dark' | 'auto';
  /**
   * Whether the three geometric dots animate sequentially
   */
  animated?: boolean;
  /**
   * Size preset or numeric pixel height of the monogram
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /**
   * Whether to wrap the monogram in the Swiss modernist rounded-square container
   */
  showBadge?: boolean;
  /**
   * Optional secondary subtitle (e.g., "Code Review Assistant")
   */
  subtitle?: string;
  /**
   * Additional container CSS classes
   */
  className?: string;
}

/**
 * Custom geometric Swiss Modernist R Monogram SVG Path
 * Mathematically constructed on a 32x32 grid with balanced proportions.
 */
export const RMonogramSVG: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 32, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RevAI R Monogram"
    >
      {/* Precision Geometric Monogram R */}
      <path
        d="M7 5.5H16.5C20.09 5.5 23 8.41 23 12C23 14.88 21.13 17.33 18.51 18.17L25 26.5H19.7L13.95 18.5H12V26.5H7V5.5ZM12 9.5V14.5H16.5C17.88 14.5 19 13.38 19 12C19 10.62 17.88 9.5 16.5 9.5H12Z"
        fill={color}
      />
    </svg>
  );
};

/**
 * Three Geometric Dots Component
 * Supports sequential forward-scanning motion or crisp static resting alignment.
 */
export const LogoDots: React.FC<{
  animated?: boolean;
  color?: string;
  size?: number;
  className?: string;
}> = ({ animated = false, color = '#47745D', size = 3.5, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 select-none ${className}`}
      aria-hidden="true"
    >
      <span
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
        className={`rounded-full shrink-0 ${
          animated ? 'animate-revai-dot-1' : 'opacity-85'
        }`}
      />
      <span
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
        className={`rounded-full shrink-0 ${
          animated ? 'animate-revai-dot-2' : 'opacity-85'
        }`}
      />
      <span
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
        className={`rounded-full shrink-0 ${
          animated ? 'animate-revai-dot-3' : 'opacity-85'
        }`}
      />
    </span>
  );
};

/**
 * Primary RevAI Logo Identity Component
 */
export const RevAILogo: React.FC<RevAILogoProps> = ({
  layout = 'full',
  theme = 'light',
  animated = false,
  size = 'md',
  showBadge = false,
  subtitle,
  className = '',
}) => {
  // Resolve numeric size for monogram
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'xs'
      ? 20
      : size === 'sm'
      ? 24
      : size === 'md'
      ? 30
      : size === 'lg'
      ? 40
      : 56;

  // Dot size proportional to monogram size
  const dotSize = Math.max(2.5, Math.round(pixelSize * 0.11));

  // Color schemes based on Swiss Modernist Brand Palette
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#F5F3ED' : '#24342E'; // Warm Ivory on dark / Forest Green on light
  const accentColor = '#47745D'; // Muted Green for dots & "AI"
  const badgeBg = isDark ? 'rgba(245, 243, 237, 0.08)' : '#E9E7DF';
  const badgeBorder = isDark ? 'rgba(245, 243, 237, 0.15)' : '#DDDCD3';
  const subtitleColor = isDark ? '#9CA3AF' : '#5C645B';

  // Standalone Monogram
  const monogramElement = (
    <div
      style={{
        width: showBadge ? `${pixelSize + 8}px` : `${pixelSize}px`,
        height: showBadge ? `${pixelSize + 8}px` : `${pixelSize}px`,
        backgroundColor: showBadge ? badgeBg : 'transparent',
        borderColor: showBadge ? badgeBorder : 'transparent',
      }}
      className={`shrink-0 flex items-center justify-center transition-colors ${
        showBadge ? 'rounded-lg border' : ''
      }`}
    >
      <RMonogramSVG size={pixelSize} color={primaryColor} />
    </div>
  );

  if (layout === 'monogram') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {monogramElement}
      </div>
    );
  }

  // Wordmark typography
  const textScale =
    pixelSize <= 24
      ? 'text-base'
      : pixelSize <= 32
      ? 'text-lg'
      : pixelSize <= 44
      ? 'text-2xl'
      : 'text-3xl';

  const wordmarkElement = (
    <div className="flex flex-col justify-center leading-none">
      <div className="flex items-center tracking-tight font-sans">
        <span
          style={{ color: primaryColor }}
          className={`${textScale} font-semibold`}
        >
          Rev
        </span>
        <span
          style={{ color: accentColor }}
          className={`${textScale} font-medium`}
        >
          AI
        </span>
      </div>
      {subtitle && (
        <span
          style={{ color: subtitleColor }}
          className="text-[10px] font-mono tracking-wider uppercase mt-1"
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  // Stacked Layout (e.g. Loading Screen / Splash / Center Hero)
  if (layout === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center gap-3.5 ${className}`}
      >
        {monogramElement}
        <LogoDots
          animated={animated}
          color={accentColor}
          size={dotSize + 0.5}
          className="my-0.5"
        />
        {wordmarkElement}
      </div>
    );
  }

  // Full Horizontal Lockup (Monogram + 3 Dots + Wordmark)
  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {monogramElement}
      <LogoDots
        animated={animated}
        color={accentColor}
        size={dotSize}
        className="px-0.5"
      />
      {wordmarkElement}
    </div>
  );
};

export default RevAILogo;
