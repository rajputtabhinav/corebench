import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium outline-none transition-[background,color,box-shadow,border-color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        accent:
          "bg-accent text-on-accent shadow-xs hover:bg-accent-600 active:bg-accent-700",
        default:
          "bg-surface text-foreground border border-border-strong shadow-xs hover:bg-surface-2 hover:border-border-strong",
        subtle:
          "bg-neutral-soft text-foreground hover:bg-border",
        ghost:
          "text-muted-foreground hover:bg-neutral-soft hover:text-foreground",
        outline:
          "border border-border-strong text-foreground hover:bg-surface-2",
        danger:
          "bg-danger text-white shadow-xs hover:opacity-90",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-9 px-3.5 text-sm",
        lg: "h-11 px-5 text-sm",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
