import React from 'react';
import {cn} from '@/utils/Helpers';

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  fullHeight?: boolean;
};

const Container = ({ref, className, children, fullHeight = false}: ContainerProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'u-container',
        fullHeight && 'h-full flex flex-col',
        className
      )}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';

export {Container};
