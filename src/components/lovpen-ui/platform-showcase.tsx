import * as React from 'react';
import {cn} from '@/lib/utils';
import {Steps} from "@/components/lovpen-ui/steps";
import {Platforms} from "@/components/lovpen-ui/platforms";

export type PlatformShowcaseProps = {} & React.HTMLAttributes<HTMLDivElement>

const PlatformShowcase = ({ref, className, ...props}: PlatformShowcaseProps & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div ref={ref} className={cn('space-y-8', className)} {...props}>
      <Steps/>

      <Platforms/>
    </div>
  );
};

PlatformShowcase.displayName = 'PlatformShowcase';

export {PlatformShowcase};
