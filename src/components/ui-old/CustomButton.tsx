import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import * as React from 'react';
import {cn} from '@/lib/utils';
import {Button as ShadcnButton} from './button';

const customButtonVariants = cva(
  '',
  {
    variants: {
      variant: {
        default: 'text-white bg-primary hover:opacity-90 shadow-sm',
        destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'text-primary bg-transparent border border-primary hover:bg-primary hover:text-white shadow-sm',
        secondary: 'text-text-main bg-transparent border border-border-default hover:bg-gray-50 shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        primary: 'text-white bg-primary hover:opacity-90 shadow-sm',
      },
      size: {
        default: 'px-6 py-3 text-base rounded-md',
        sm: 'px-4 py-2 text-sm rounded-md',
        lg: 'px-8 py-4 text-lg rounded-lg',
        icon: 'size-9',
        md: 'px-6 py-3 text-base rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type CustomButtonProps = {
  href?: string;
} & React.ComponentProps<typeof ShadcnButton> & VariantProps<typeof customButtonVariants>;

const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>((
  {
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    href,
    children,
    ...props
  },
  ref
) => {
  const customClassName = cn(
    customButtonVariants({variant, size}),
    className
  );

  if (href && !asChild) {
    return (
      <a
        href={href}
        className={customClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <ShadcnButton
      className={customClassName}
      variant="ghost"
      size="default"
      asChild={asChild}
      ref={ref}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
});

Button.displayName = 'CustomButton';

export {Button, type CustomButtonProps as ButtonProps};
