import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 text-zinc-900 hover:bg-white shadow-xs',
        primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs shadow-indigo-950/20',
        secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-750 border border-zinc-700/60',
        ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60',
        outline: 'border border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white',
        destructive: 'bg-rose-600 text-white hover:bg-rose-500 shadow-xs',
        subtle: 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-800/80',
        link: 'text-indigo-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-3.5 py-2 text-xs',
        sm: 'h-7 rounded-lg px-2.5 text-xs',
        lg: 'h-10 rounded-xl px-5 text-sm',
        icon: 'h-8 w-8 rounded-lg p-0',
        iconSm: 'h-7 w-7 rounded-md p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
