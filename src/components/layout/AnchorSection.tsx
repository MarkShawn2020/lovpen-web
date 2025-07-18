import {createElement, ReactNode} from 'react';
import {cn} from '@/lib/utils';

type AnchorSectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function AnchorSection({
  id,
  children,
  className,
  as: Component = 'section',
}: AnchorSectionProps) {
  return createElement(
    Component,
    {
      id,
      className: cn('scroll-mt-[80px] p-8', className),
    },
    children,
  );
}
