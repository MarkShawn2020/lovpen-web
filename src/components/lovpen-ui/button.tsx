import type {VariantProps} from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'text-white bg-primary hover:bg-primary-hover active:bg-primary-active shadow-sm rounded-md',
        secondary: 'text-text-main bg-transparent border border-border-default hover:bg-background-ivory-medium shadow-sm rounded-md',
        outline: 'text-primary bg-transparent border border-primary hover:bg-primary hover:text-white shadow-sm rounded-md',
        ghost: 'text-text-main hover:bg-background-ivory-medium rounded-md',
        link: 'text-primary underline underline-offset-4 decoration-from-font hover:text-primary-hover',
        success: 'text-white bg-success hover:bg-success/90 shadow-sm rounded-md',
        warning: 'text-white bg-warning hover:bg-warning/90 shadow-sm rounded-md',
        error: 'text-white bg-error hover:bg-error/90 shadow-sm rounded-md',
        info: 'text-white bg-info hover:bg-info/90 shadow-sm rounded-md',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonProps = {
  asChild?: boolean;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

const Button = ({ ref, className, variant, size, asChild = false, href, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
          ref={ref}
        />
      );
    }

    if (href) {
      return (
        <a
          className={cn(buttonVariants({ variant, size, className }))}
          href={href}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {props.children}
        </a>
      );
    }

    return (
      <button
        type="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        ref={ref}
      />
    );
  };

Button.displayName = 'Button';

export { Button, buttonVariants };
