import type {VariantProps} from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'text-white bg-primary hover:opacity-90 shadow-sm',
        secondary: 'text-text-main bg-transparent border border-border-default hover:bg-gray-50 shadow-sm',
        outline: 'text-primary bg-transparent border border-primary hover:bg-primary hover:text-white shadow-sm',
        ghost: 'text-text-main hover:bg-gray-50',
        link: 'text-primary underline underline-offset-4 decoration-from-font hover:opacity-80',
      },
      size: {
        sm: 'px-4 py-2 text-sm rounded-md',
        md: 'px-6 py-3 text-base rounded-md',
        lg: 'px-8 py-4 text-lg rounded-lg',
        icon: 'size-9 rounded-md',
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    const Comp = asChild ? Slot : href ? 'a' : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(href ? { href } : {})}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
