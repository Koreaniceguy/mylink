import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-xl border border-[#E5E8EB] dark:border-zinc-700 bg-[#F9FAFB] dark:bg-zinc-800/80 px-3 py-1.5 text-xs text-[#191F28] dark:text-white placeholder:text-[#8B95A1] transition-all file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:outline-none focus-visible:border-[#3182F6] focus-visible:ring-2 focus-visible:ring-[#3182F6]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
