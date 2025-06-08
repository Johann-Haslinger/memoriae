import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  [
    "inline-flex cursor-pointer  items-center justify-center rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none dark:outline-none ring-offset-neutral-700 ring-offset-0 focus-visible:ring-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-blue-500 text-white dark:text-black dark:bg-neutral-100/90",
          "hover:bg-blue-600",
          "focus-visible:ring-focus dark:focus-visible:ring-blue-400/80 focus-visible:dark:bg-neutral-100 ",
          "dark:hover:bg-neutral-100 dark:active:bg-neutral-100/60",
        ],
        secondary: [
          "bg-[#2a2a2a] text-white",
          "hover:bg-[#333333] dark:hover:bg-white/10",
          "focus-visible:ring-[#404040] dark:focus-visible:ring-blue-400/80 ",
          "dark:bg-[#1a1a1a]/80 dark:hover:bg-[#1a1a1a] dark:active:bg-[#1a1a1a]/60",
          "dark:text-[#999999]",
        ],
        ghost: [
          "hover:bg-[#333333]/10 hover:text-[#FFFFFFCF]",
          "focus-visible:ring-[#404040] dark:focus-visible:ring-blue-400/80",
          "dark:bg-transparent dark:hover:bg-white/10 dark:active:bg-white/5",
        ],
        destructive: [
          "bg-red-500 text-white",
          "hover:bg-red-600",
          "focus-visible:ring-red-500",
          "dark:bg-red-600/80 dark:hover:bg-red-600 dark:active:bg-red-600/60",
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
