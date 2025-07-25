import * as React from 'react';
import { cn } from '@/lib/utils';

export type LogoVariant = 'horizontal' | 'vertical' | 'pure';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

export type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  color?: string;
} & React.HTMLAttributes<HTMLDivElement>

// Size configurations for different variants
const sizeConfigs = {
  horizontal: {
    sm: { width: 80, height: 24 },
    md: { width: 120, height: 36 },
    lg: { width: 160, height: 48 },
    xl: { width: 240, height: 72 },
  },
  vertical: {
    sm: { width: 32, height: 48 },
    md: { width: 48, height: 72 },
    lg: { width: 64, height: 96 },
    xl: { width: 96, height: 144 },
  },
  pure: {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
  },
};

// Horizontal Logo Component (logo + text)
const HorizontalLogo = ({ size, className, color }: { size: LogoSize; className?: string; color?: string }) => {
  const { width, height } = sizeConfigs.horizontal[size];
  const gradientId = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const isGradient = className?.includes('text-brand-gradient');
  const isBrandPrimary = className?.includes('text-brand-primary');
  
  let fillColor = color || 'currentColor';
  if (isGradient) {
    fillColor = `url(#${gradientId})`;
  } else if (isBrandPrimary) {
    fillColor = '#d97757';
  }
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="635 459 649 128"
      className={cn('transition-all duration-200', className)}
      fill={fillColor}
    >
      {isGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97757" />
            <stop offset="100%" stopColor="#629a90" />
          </linearGradient>
        </defs>
      )}
      <g>
        <path d="M635.3,459.33L635.3,459.33v91.19c0,23.24,18.84,42.09,42.09,42.09l0,0v-91.19C677.39,478.18,658.55,459.33,635.3,459.33z" />
        <path d="M687.91,487.39L687.91,487.39v91.19c0,23.24,18.84,42.09,42.09,42.09l0,0v-91.19C730,506.23,711.16,487.39,687.91,487.39z" />
        <path d="M740.52,472.95v84.17c23.24,0,42.09-18.84,42.09-42.09S763.77,472.95,740.52,472.95z" />
        <polygon points="843.75,490.15 824.85,490.15 824.85,587.32 883.02,587.32 883.02,570.68 843.75,570.68" />
        <path d="M957.7,523.76c-3.37-3.42-7.5-6.14-12.38-8.19c-4.88-2.04-10.38-3.06-16.51-3.06c-6.12,0-11.65,1.02-16.57,3.06c-4.93,2.04-9.08,4.77-12.45,8.19c-3.37,3.42-5.97,7.39-7.79,11.91c-1.82,4.53-2.73,9.27-2.73,14.24v2.8c0,4.79,0.87,9.43,2.6,13.91c1.73,4.48,4.28,8.43,7.65,11.85c3.37,3.42,7.5,6.17,12.38,8.25c4.88,2.08,10.52,3.13,16.91,3.13c6.3,0,11.91-1.04,16.84-3.13c4.93-2.08,9.05-4.84,12.38-8.25c3.33-3.42,5.86-7.37,7.59-11.85c1.73-4.48,2.6-9.12,2.6-13.91v-2.8c0-4.97-0.91-9.72-2.73-14.24C963.67,531.15,961.07,527.18,957.7,523.76z M948.31,560.3c-0.93,2.75-2.29,5.15-4.06,7.19c-1.78,2.04-3.95,3.64-6.52,4.79c-2.58,1.15-5.55,1.73-8.92,1.73c-3.37,0-6.37-0.58-8.99-1.73c-2.62-1.15-4.82-2.75-6.59-4.79c-1.78-2.04-3.13-4.44-4.06-7.19c-0.93-2.75-1.4-5.77-1.4-9.05c0-3.28,0.49-6.32,1.46-9.12c0.98-2.8,2.35-5.21,4.13-7.25c1.77-2.04,3.97-3.64,6.59-4.79c2.62-1.15,5.57-1.73,8.85-1.73c3.28,0,6.21,0.58,8.79,1.73c2.57,1.15,4.75,2.75,6.52,4.79c1.77,2.04,3.15,4.46,4.13,7.25c0.98,2.8,1.46,5.84,1.46,9.12C949.71,554.53,949.25,557.55,948.31,560.3z" />
        <polygon points="1010.7,572.15 1007.64,572.15 990.47,515.04 971.43,515.04 994.07,587.32 1023.75,587.32 1043.32,515.04 1025.48,515.04" />
        <path d="M1116.52,498.88c-6.66-5.82-16.15-8.73-28.49-8.73h-33.55v97.18h18.9v-29.55h14.64c6.12,0,11.58-0.77,16.37-2.32c4.79-1.54,8.81-3.73,12.05-6.55c3.24-2.82,5.72-6.26,7.45-10.32c1.73-4.06,2.6-8.6,2.6-13.63v-2.12C1126.5,512.69,1123.18,504.71,1116.52,498.88z M1102.74,536.53c-3.06,3.25-7.43,4.87-13.11,4.87h-16.24v-34.88h16.24c5.68,0,10.05,1.58,13.11,4.74c3.06,3.16,4.59,7.37,4.59,12.63C1107.33,529.07,1105.8,533.28,1102.74,536.53z" />
        <path d="M1195.95,523.56c-3.02-3.37-6.72-6.06-11.12-8.05c-4.39-2-9.52-3-15.38-3c-5.95,0-11.18,1.04-15.71,3.13c-4.53,2.09-8.32,4.88-11.38,8.39c-3.06,3.51-5.37,7.5-6.92,11.98c-1.55,4.48-2.33,9.12-2.33,13.91v2.53c0,4.62,0.78,9.16,2.33,13.65c1.55,4.48,3.86,8.48,6.92,11.98c3.06,3.51,6.92,6.35,11.58,8.52c4.66,2.17,10.09,3.26,16.31,3.26c4.44,0,8.54-0.6,12.31-1.8c3.77-1.2,7.1-2.86,9.98-4.99c2.88-2.13,5.28-4.73,7.19-7.79c1.91-3.06,3.26-6.46,4.06-10.18h-17.04c-0.8,2.66-2.62,4.91-5.46,6.72c-2.84,1.82-6.52,2.73-11.05,2.73c-6.12,0-10.78-1.73-13.98-5.19c-3.2-3.46-5.1-8.03-5.72-13.71H1205v-6.66c0-4.79-0.76-9.39-2.26-13.78C1201.23,530.81,1198.96,526.93,1195.95,523.56z M1150.96,544.33c0.97-5.24,2.99-9.3,6.06-12.18c3.06-2.88,7.21-4.33,12.45-4.33c5.24,0,9.34,1.44,12.31,4.33c2.97,2.88,4.81,6.95,5.52,12.18H1150.96z" />
        <path d="M1278.04,520.79c-4.44-5.52-10.96-8.28-19.57-8.28h-0.8c-13.4,0-21.65,6.79-24.76,20.37v-17.84h-14.64v72.28h18.5v-42.66c0-4.72,1.4-8.49,4.19-11.3c2.8-2.81,6.46-4.21,10.98-4.21c4.44,0,7.92,1.36,10.45,4.08c2.53,2.72,3.79,6.35,3.79,10.9v43.19h18.5v-41.55C1284.7,534.64,1282.48,526.32,1278.04,520.79z" />
      </g>
    </svg>
  );
};

// Vertical Logo Component (logo on top, text below)
const VerticalLogo = ({ size, className, color }: { size: LogoSize; className?: string; color?: string }) => {
  const { width, height } = sizeConfigs.vertical[size];
  const gradientId = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const isGradient = className?.includes('text-brand-gradient');
  const isBrandPrimary = className?.includes('text-brand-primary');
  
  let fillColor = color || 'currentColor';
  if (isGradient) {
    fillColor = `url(#${gradientId})`;
  } else if (isBrandPrimary) {
    fillColor = '#d97757';
  }
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="730 402 509 287"
      className={cn('transition-all duration-200', className)}
      fill={fillColor}
    >
      {isGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97757" />
            <stop offset="100%" stopColor="#629a90" />
          </linearGradient>
        </defs>
      )}
      <g>
        <path d="M928.43,521.71v-91.19c0-23.24-18.84-42.09-42.09-42.09h0v91.19C886.35,502.87,905.19,521.71,928.43,521.71z" />
        <path d="M981.04,549.77v-91.19c0-23.24-18.84-42.09-42.09-42.09h0v91.19C938.96,530.93,957.8,549.77,981.04,549.77L981.04,549.77z" />
        <path d="M991.57,402.05L991.57,402.05l0,84.17h0c23.24,0,42.09-18.84,42.09-42.09C1033.65,420.89,1014.81,402.05,991.57,402.05z" />
        <g>
          <polygon points="748.98,591.86 730.08,591.86 730.08,689.03 788.25,689.03 788.25,672.39 748.98,672.39" />
          <path d="M862.93,625.47c-3.37-3.42-7.5-6.14-12.38-8.19c-4.88-2.04-10.38-3.06-16.51-3.06c-6.12,0-11.65,1.02-16.57,3.06c-4.93,2.04-9.08,4.77-12.45,8.19c-3.37,3.42-5.97,7.39-7.79,11.91c-1.82,4.53-2.73,9.27-2.73,14.24v2.8c0,4.79,0.87,9.43,2.6,13.91c1.73,4.48,4.28,8.43,7.65,11.85c3.37,3.42,7.5,6.17,12.38,8.25c4.88,2.08,10.52,3.13,16.91,3.13c6.3,0,11.91-1.04,16.84-3.13c4.93-2.08,9.05-4.84,12.38-8.25c3.33-3.42,5.86-7.37,7.59-11.85c1.73-4.48,2.6-9.12,2.6-13.91v-2.8c0-4.97-0.91-9.72-2.73-14.24C868.89,632.86,866.3,628.89,862.93,625.47z M853.54,662.01c-0.93,2.75-2.29,5.15-4.06,7.19c-1.78,2.04-3.95,3.64-6.52,4.79c-2.58,1.15-5.55,1.73-8.92,1.73c-3.37,0-6.37-0.58-8.99-1.73c-2.62-1.15-4.82-2.75-6.59-4.79c-1.78-2.04-3.13-4.44-4.06-7.19c-0.93-2.75-1.4-5.77-1.4-9.05c0-3.28,0.49-6.32,1.46-9.12c0.98-2.8,2.35-5.21,4.13-7.26c1.77-2.04,3.97-3.64,6.59-4.79c2.62-1.15,5.57-1.73,8.85-1.73c3.28,0,6.21,0.58,8.79,1.73c2.57,1.15,4.75,2.75,6.52,4.79c1.77,2.04,3.15,4.46,4.13,7.26c0.98,2.8,1.46,5.84,1.46,9.12C854.94,656.24,854.47,659.26,853.54,662.01z" />
          <polygon points="915.93,673.86 912.87,673.86 895.7,616.75 876.66,616.75 899.29,689.03 928.98,689.03 948.54,616.75 930.71,616.75" />
          <path d="M1021.75,600.59c-6.66-5.82-16.15-8.73-28.49-8.73h-33.55v97.18h18.9v-29.55h14.64c6.12,0,11.58-0.77,16.37-2.31c4.79-1.54,8.81-3.73,12.05-6.55c3.24-2.82,5.72-6.26,7.45-10.32c1.73-4.06,2.6-8.6,2.6-13.63v-2.12C1031.73,614.4,1028.4,606.42,1021.75,600.59z M1007.97,638.24c-3.06,3.25-7.43,4.87-13.11,4.87h-16.24v-34.88h16.24c5.68,0,10.05,1.58,13.11,4.74c3.06,3.16,4.59,7.37,4.59,12.63C1012.56,630.78,1011.03,634.99,1007.97,638.24z" />
          <path d="M1101.18,625.27c-3.02-3.37-6.72-6.06-11.12-8.05c-4.39-2-9.52-3-15.38-3c-5.95,0-11.18,1.04-15.71,3.13c-4.53,2.09-8.32,4.88-11.38,8.39c-3.06,3.51-5.37,7.5-6.92,11.98c-1.55,4.48-2.33,9.12-2.33,13.91v2.53c0,4.62,0.78,9.16,2.33,13.64c1.55,4.48,3.86,8.48,6.92,11.98c3.06,3.51,6.92,6.35,11.58,8.52c4.66,2.17,10.09,3.26,16.31,3.26c4.44,0,8.54-0.6,12.31-1.8c3.77-1.2,7.1-2.86,9.98-4.99c2.88-2.13,5.28-4.73,7.19-7.79c1.91-3.06,3.26-6.46,4.06-10.18h-17.04c-0.8,2.66-2.62,4.9-5.46,6.72c-2.84,1.82-6.52,2.73-11.05,2.73c-6.12,0-10.78-1.73-13.98-5.19c-3.19-3.46-5.1-8.03-5.72-13.71h54.44v-6.66c0-4.79-0.76-9.38-2.26-13.78C1106.45,632.53,1104.19,628.64,1101.18,625.27z M1056.18,646.04c0.97-5.24,2.99-9.3,6.06-12.18c3.06-2.88,7.21-4.33,12.45-4.33c5.24,0,9.34,1.44,12.31,4.33c2.97,2.88,4.81,6.94,5.52,12.18H1056.18z" />
          <path d="M1183.27,622.5c-4.44-5.52-10.96-8.28-19.57-8.28h-0.8c-13.4,0-21.65,6.79-24.76,20.37v-17.84h-14.64v72.28h18.5v-42.66c0-4.72,1.4-8.49,4.19-11.3c2.8-2.81,6.46-4.21,10.98-4.21c4.44,0,7.92,1.36,10.45,4.08c2.53,2.72,3.79,6.35,3.79,10.9v43.19h18.5v-41.55C1189.92,636.36,1187.7,628.03,1183.27,622.5z" />
        </g>
      </g>
    </svg>
  );
};

// Pure Logo Component (icon only)
const PureLogo = ({ size, className, color }: { size: LogoSize; className?: string; color?: string }) => {
  const { width, height } = sizeConfigs.pure[size];
  const gradientId = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const isGradient = className?.includes('text-brand-gradient');
  const isBrandPrimary = className?.includes('text-brand-primary');
  
  let fillColor = color || 'currentColor';
  if (isGradient) {
    fillColor = `url(#${gradientId})`;
  } else if (isBrandPrimary) {
    fillColor = '#d97757';
  }
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="818 385 284 310"
      className={cn('transition-all duration-200', className)}
      fill={fillColor}
    >
      {isGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97757" />
            <stop offset="100%" stopColor="#629a90" />
          </linearGradient>
        </defs>
      )}
      <g>
        <path d="M899.41,640.99V465.94c0-44.62-36.17-80.79-80.79-80.79h0V560.2C818.62,604.82,854.79,640.99,899.41,640.99z" />
        <path d="M1000.4,694.85V519.8c0-44.62-36.17-80.79-80.79-80.79h0v175.05C919.6,658.68,955.78,694.85,1000.4,694.85L1000.4,694.85z" />
        <path d="M1020.59,411.29L1020.59,411.29l0,161.58h0c44.62,0,80.79-36.17,80.79-80.79C1101.38,447.46,1065.21,411.29,1020.59,411.29z" />
      </g>
    </svg>
  );
};

const Logo = ({ ref, variant = 'horizontal', size = 'md', className, color, ...props }: LogoProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    const renderContent = () => {
      switch (variant) {
        case 'vertical':
          return <VerticalLogo size={size} className={className} color={color} />;
        case 'pure':
          return <PureLogo size={size} className={className} color={color} />;
        case 'horizontal':
        default:
          return <HorizontalLogo size={size} className={className} color={color} />;
      }
    };

    return (
      <div ref={ref} className={cn('inline-flex items-center justify-center', className)} {...props}>
        {renderContent()}
      </div>
    );
  };

Logo.displayName = 'Logo';

// LogoWithText is now just an alias for horizontal variant
export type LogoWithTextProps = Omit<LogoProps, 'variant'>

const LogoWithText = ({ ref, size = 'md', className, color, ...props }: LogoWithTextProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group transition-all duration-200',
          'hover:scale-105 hover:opacity-90',
          className,
        )}
        {...props}
      >
        <Logo variant="horizontal" size={size} color={color} className={className} />
      </div>
    );
  };

LogoWithText.displayName = 'LogoWithText';

export { HorizontalLogo, Logo, LogoWithText, PureLogo, VerticalLogo };
