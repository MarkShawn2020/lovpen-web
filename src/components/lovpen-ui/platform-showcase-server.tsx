import * as React from 'react';
import {cn} from '@/lib/utils';
import {StepsServer} from "./steps-server";
import {Platforms} from "./platforms";

export type PlatformShowcaseServerProps = {
  locale?: string;
} & React.HTMLAttributes<HTMLDivElement>

const PlatformShowcaseServer = ({ref, className, locale, ...props}: PlatformShowcaseServerProps & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div ref={ref} className={cn('space-y-8', className)} {...props}>
      <StepsServer locale={locale} />

      <Platforms/>
    </div>
  );
};

PlatformShowcaseServer.displayName = 'PlatformShowcaseServer';

export {PlatformShowcaseServer};
