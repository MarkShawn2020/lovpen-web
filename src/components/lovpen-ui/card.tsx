import * as React from 'react';
import { cn } from '@/lib/utils';

export type CardProps = {} & React.HTMLAttributes<HTMLDivElement>

const Card = ({ ref, className, ...props }: CardProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col h-full gap-6 p-8 bg-background-main rounded-2xl shadow-md',
        className
      )}
      {...props}
    />
  );

Card.displayName = 'Card';

export type CardIconProps = {} & React.HTMLAttributes<HTMLDivElement>

const CardIcon = ({ ref, className, ...props }: CardIconProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={ref}
      className={cn('w-16 h-16 flex-shrink-0', className)}
      {...props}
    />
  );

CardIcon.displayName = 'CardIcon';

export type CardHeaderProps = {} & React.HTMLAttributes<HTMLDivElement>

const CardHeader = ({ ref, className, ...props }: CardHeaderProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={ref}
      className={cn('', className)}
      {...props}
    />
  );

CardHeader.displayName = 'CardHeader';

export type CardContentProps = {} & React.HTMLAttributes<HTMLDivElement>

const CardContent = ({ ref, className, ...props }: CardContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={ref}
      className={cn('flex flex-col flex-grow', className)}
      {...props}
    />
  );

CardContent.displayName = 'CardContent';

export { Card, CardContent, CardHeader, CardIcon };
