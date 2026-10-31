import React from 'react';

export interface RevAILogoProps {
  /**
   * Layout format:
   * - 'full': Hexagonal Monogram + 3 Dots + Wordmark (default)
   * - 'monogram': Standalone Hexagonal R Emblem only (favicon, app icon, compact UI)
   * - 'stacked': Hexagonal Emblem top, dots middle, wordmark bottom (for loading/hero screens)
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

// Exact vectorized paths from user's selected reference logo design
const HEX_PATH_TOP_RIGHT =
  'M 47.86 6.10 L 51.12 6.02 L 54.13 6.31 L 57.59 7.11 L 61.40 8.59 L 88.48 24.14 L 89.76 24.91 L 90.00 25.41 L 89.95 39.70 L 89.71 43.46 L 88.98 47.05 L 87.98 49.93 L 86.97 52.07 L 85.22 54.97 L 83.71 56.92 L 82.00 58.76 L 79.70 60.76 L 77.92 62.02 L 54.88 75.24 L 53.38 74.25 L 52.12 73.67 L 50.87 73.39 L 49.87 73.35 L 48.86 73.45 L 47.36 73.93 L 45.35 75.25 L 45.10 75.26 L 41.64 73.30 L 40.34 72.32 L 39.09 70.82 L 38.33 69.33 L 38.01 68.28 L 37.79 66.53 L 37.83 59.25 L 38.08 59.09 L 38.33 59.20 L 49.12 65.45 L 49.62 65.66 L 50.37 65.68 L 51.12 65.37 L 73.69 52.35 L 75.44 51.11 L 76.44 50.14 L 77.52 48.73 L 78.36 47.22 L 79.07 45.22 L 79.33 43.71 L 79.43 38.70 L 79.61 38.45 L 81.46 37.49 L 82.80 36.19 L 83.83 34.19 L 84.09 33.18 L 84.14 31.68 L 83.63 29.68 L 82.74 28.17 L 81.71 27.11 L 79.95 26.10 L 78.45 25.73 L 76.19 25.79 L 74.69 26.33 L 73.18 27.33 L 72.68 27.30 L 51.37 15.01 L 48.11 13.32 L 44.60 12.02 L 41.59 11.29 L 35.41 10.62 L 37.83 9.09 L 41.14 7.61 L 43.85 6.77 L 47.86 6.10 Z';

const HEX_PATH_LEFT_STEM =
  'M 34.07 14.13 L 37.58 14.08 L 40.31 14.38 L 42.78 14.88 L 46.46 16.14 L 49.87 17.88 L 71.09 30.18 L 71.24 30.68 L 71.06 32.68 L 71.30 33.94 L 71.78 35.19 L 72.64 36.44 L 73.69 37.42 L 76.00 38.70 L 75.94 43.97 L 75.00 46.47 L 73.43 48.43 L 72.39 49.23 L 69.40 50.99 L 66.35 52.74 L 65.66 52.92 L 65.55 40.20 L 65.49 39.70 L 65.05 38.95 L 42.10 25.60 L 39.09 24.33 L 37.33 24.01 L 35.58 23.97 L 33.57 24.27 L 31.82 24.84 L 27.30 27.32 L 26.80 27.22 L 24.80 26.05 L 23.04 25.67 L 20.78 25.85 L 18.78 26.77 L 17.48 27.92 L 16.66 29.17 L 16.11 30.68 L 15.96 32.68 L 16.35 34.44 L 17.13 35.94 L 18.78 37.57 L 20.51 38.45 L 20.72 38.95 L 20.84 62.52 L 21.02 67.03 L 21.29 68.97 L 22.00 72.05 L 23.04 75.15 L 25.11 79.32 L 25.19 79.57 L 25.05 79.79 L 22.29 78.34 L 19.78 76.63 L 17.53 74.73 L 15.77 72.88 L 14.40 71.04 L 12.65 68.03 L 11.57 65.53 L 10.91 63.27 L 10.11 59.26 L 9.99 56.75 L 10.19 25.41 L 10.51 24.86 L 23.04 17.64 L 25.45 16.39 L 29.56 14.88 L 34.07 14.13 Z';

const HEX_PATH_BOTTOM_LOOP =
  'M 34.82 27.40 L 37.33 27.35 L 39.34 27.90 L 45.98 31.68 L 46.37 31.93 L 46.45 32.18 L 35.58 38.54 L 34.70 39.45 L 34.56 40.46 L 34.60 64.52 L 34.71 68.03 L 35.19 70.04 L 35.94 71.79 L 37.30 73.80 L 38.59 75.08 L 39.34 75.69 L 43.59 78.31 L 43.53 80.57 L 43.70 81.57 L 44.17 82.83 L 45.35 84.50 L 46.86 85.64 L 48.36 86.26 L 50.37 86.47 L 52.12 86.13 L 53.88 85.26 L 55.32 83.83 L 56.26 82.07 L 56.60 80.57 L 56.49 78.56 L 56.64 78.19 L 78.70 65.45 L 80.71 64.16 L 82.96 62.42 L 85.47 59.99 L 87.88 57.00 L 89.48 54.47 L 89.73 54.17 L 89.89 54.50 L 89.88 57.00 L 89.49 60.76 L 88.98 62.97 L 88.23 65.28 L 86.97 68.07 L 85.72 70.21 L 84.22 72.31 L 82.21 74.55 L 79.93 76.56 L 77.39 78.31 L 50.12 94.00 L 49.15 93.61 L 36.50 86.34 L 34.32 84.86 L 31.82 82.75 L 29.39 80.07 L 27.19 76.81 L 25.73 73.80 L 24.43 69.54 L 24.09 67.53 L 23.89 64.77 L 24.04 38.76 L 24.29 38.48 L 25.80 37.83 L 26.80 37.11 L 28.17 35.44 L 28.64 34.44 L 28.97 33.18 L 28.88 30.43 L 29.05 30.18 L 32.57 28.15 L 34.82 27.40 Z';

/**
 * Exact Geometric R Hexagonal Monogram SVG
 */
export const RMonogramSVG: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  animated?: boolean;
}> = ({ className = '', size = 32, color = 'currentColor', animated = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RevAI Hexagonal R Emblem"
    >
      {/* Three Interlocking Hexagonal Arms */}
      <path d={HEX_PATH_TOP_RIGHT} fill={color} />
      <path d={HEX_PATH_LEFT_STEM} fill={color} />
      <path d={HEX_PATH_BOTTOM_LOOP} fill={color} />

      {/* Sequential Animated Three Dots on the Three Emblem Nodes */}
      {animated ? (
        <>
          <circle
            cx="30.8"
            cy="41.0"
            r="4.8"
            fill="#47745D"
            className="animate-revai-emblem-dot-1"
          />
          <circle
            cx="69.7"
            cy="41.0"
            r="4.8"
            fill="#47745D"
            className="animate-revai-emblem-dot-2"
          />
          <circle
            cx="49.6"
            cy="74.3"
            r="4.8"
            fill="#47745D"
            className="animate-revai-emblem-dot-3"
          />
        </>
      ) : null}
    </svg>
  );
};

/**
 * Three Geometric External Dots Component
 * Smooth, sequential staggered forward movement
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
  // Numeric size resolution
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
      ? 42
      : 56;

  // External dot size proportional to monogram
  const dotSize = Math.max(2.5, Math.round(pixelSize * 0.11));

  // Color schemes based on Swiss Modernist Brand Palette
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#FFFFFF' : '#24342E';
  const accentColor = '#47745D';
  const badgeBg = isDark ? 'rgba(255, 255, 255, 0.06)' : '#E9E7DF';
  const badgeBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : '#DDDCD3';
  const subtitleColor = isDark ? '#9CA3AF' : '#5C645B';

  // Standalone Monogram Element
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
      <RMonogramSVG
        size={pixelSize}
        color={primaryColor}
        animated={animated}
      />
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

  // Stacked Layout (e.g. Starting Page / Loading Screen)
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
