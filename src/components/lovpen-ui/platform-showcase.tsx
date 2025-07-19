'use client'
import * as React from 'react';
import {cn} from '@/lib/utils';
import {Platforms} from "@/components/lovpen-ui/platforms";

export type PlatformShowcaseProps = {} & React.HTMLAttributes<HTMLDivElement>

const PlatformShowcase = ({ref, className, ...props}: PlatformShowcaseProps & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div ref={ref} className={cn('space-y-8', className)} {...props}>
      <Platforms/>
    </div>
  );
};

PlatformShowcase.displayName = 'PlatformShowcase';

export {PlatformShowcase};
