"use client";

import React from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { ThemeType } from "@/types";
import { THEME_CONFIGS } from "@/lib/themeStyles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Palette, Check } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useMyLinkStore();

  const themes: ThemeType[] = [
    "minimal-light",
    "modern-dark",
    "corporate-blue",
    "warm-beige",
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <CardTitle>테마 스타일 선택 (Themes)</CardTitle>
            <CardDescription>
              토스 디자인 시스템(TDS) 기반 4가지 프리셋
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {themes.map((t) => {
            const config = THEME_CONFIGS[t];
            const isSelected = theme === t;

            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`relative p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                  isSelected
                    ? "border-[#3182F6] ring-2 ring-[#3182F6]/20 bg-[#F8FAFF] dark:bg-zinc-800"
                    : "border-[#E5E8EB] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#3182F6] text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                {/* 테마 컬러 바 */}
                <div className="w-full h-4 rounded-md mb-2 border border-black/10 flex overflow-hidden">
                  <div
                    className="w-2/3 h-full"
                    style={{ backgroundColor: config.previewColor }}
                  />
                  <div className="w-1/3 h-full bg-white dark:bg-zinc-700" />
                </div>

                <div className="text-xs font-bold text-[#191F28] dark:text-white">
                  {config.name}
                </div>
                <div className="text-[10px] text-[#8B95A1] line-clamp-1 mt-0.5">
                  {config.description}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
