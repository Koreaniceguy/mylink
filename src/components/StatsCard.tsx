"use client";

import React from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointerClick, TrendingUp, Sparkles } from "lucide-react";

export function StatsCard() {
  const { analytics, links } = useMyLinkStore();

  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const topLink = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>실시간 분석 요약 (Analytics)</CardTitle>
              <CardDescription>LocalStorage 기반 자동 실시간 집계</CardDescription>
            </div>
          </div>
          <Badge variant="success" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            실시간 연동 중
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {/* 프로필 조회수 */}
          <div className="p-3 bg-[#F9FAFB] dark:bg-zinc-800/60 rounded-xl border border-[#F2F4F6] dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8B95A1] mb-1">
              <Eye className="w-3.5 h-3.5 text-[#3182F6]" />
              <span>총 조회수</span>
            </div>
            <div className="text-lg font-black text-[#191F28] dark:text-white">
              {analytics.pageViews.toLocaleString()}
              <span className="text-xs font-normal text-[#8B95A1] ml-1">회</span>
            </div>
          </div>

          {/* 링크 총 클릭수 */}
          <div className="p-3 bg-[#F9FAFB] dark:bg-zinc-800/60 rounded-xl border border-[#F2F4F6] dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8B95A1] mb-1">
              <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
              <span>링크 클릭수</span>
            </div>
            <div className="text-lg font-black text-[#191F28] dark:text-white">
              {totalClicks.toLocaleString()}
              <span className="text-xs font-normal text-[#8B95A1] ml-1">회</span>
            </div>
          </div>

          {/* 인기 링크 */}
          <div className="p-3 bg-[#F9FAFB] dark:bg-zinc-800/60 rounded-xl border border-[#F2F4F6] dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8B95A1] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>인기 링크 (TOP)</span>
            </div>
            <div className="text-sm font-bold text-[#191F28] dark:text-white truncate">
              {topLink && topLink.clicks > 0 ? (
                <span title={`${topLink.title} (${topLink.clicks}회)`}>
                  {topLink.title}
                  <span className="text-xs font-semibold text-[#3182F6] ml-1">
                    ({topLink.clicks})
                  </span>
                </span>
              ) : (
                <span className="text-xs font-normal text-[#8B95A1]">-</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
