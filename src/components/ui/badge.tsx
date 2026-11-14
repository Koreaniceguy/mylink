import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#3182F6] text-white hover:bg-[#1B64DA]",
        secondary:
          "border-transparent bg-[#E8F3FF] dark:bg-blue-950 text-[#3182F6] dark:text-blue-300",
        destructive:
          "border-transparent bg-rose-500 text-white hover:bg-rose-600",
        outline:
          "text-[#191F28] dark:text-white border border-[#E5E8EB] dark:border-zinc-700",
        success:
          "border-transparent bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
        muted:
          "border-transparent bg-[#F2F4F6] dark:bg-zinc-800 text-[#8B95A1]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
