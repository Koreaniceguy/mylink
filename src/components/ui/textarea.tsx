import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[60px] w-full rounded-xl border border-[#E5E8EB] dark:border-zinc-700 bg-[#F9FAFB] dark:bg-zinc-800/80 px-3.5 py-2 text-xs text-[#191F28] dark:text-white placeholder:text-[#8B95A1] transition-all focus-visible:outline-none focus-visible:border-[#3182F6] focus-visible:ring-2 focus-visible:ring-[#3182F6]/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
