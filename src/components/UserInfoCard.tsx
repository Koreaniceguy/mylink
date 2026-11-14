"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  Copy,
  Check,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function UserInfoCard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const firestorePath = `users/${user.uid}/links`;

  const handleCopyPath = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(firestorePath);
      setCopied(true);
      showToast("Firestore 경로가 복사되었습니다! 📋", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-[#3182F6]/30 bg-gradient-to-br from-white via-white to-blue-50/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/20 shadow-xs overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* 유저 기본 정보 */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User avatar"}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center font-bold text-base shadow-xs">
                  {user.displayName ? user.displayName.slice(0, 1) : <UserIcon className="w-6 h-6" />}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center" title="온라인/인증됨">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-[#191F28] dark:text-white truncate">
                  {user.displayName || "Google 사용자"}
                </span>
                <Badge variant="default" className="text-[10px] gap-1 bg-[#3182F6]">
                  <ShieldCheck className="w-3 h-3" />
                  인증 완료
                </Badge>
              </div>
              <p className="text-xs text-[#4E5968] dark:text-zinc-400 truncate mt-0.5">
                {user.email}
              </p>
              <p className="text-[11px] text-[#8B95A1] font-mono truncate mt-0.5">
                UID: {user.uid}
              </p>
            </div>
          </div>

          {/* Firestore 경로 안내 영역 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#F2F4F6] dark:bg-zinc-800/80 p-2.5 sm:p-3 rounded-xl border border-[#E5E8EB] dark:border-zinc-700/60">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#3182F6] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Database className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#4E5968] dark:text-zinc-300">
                    개인화 Firestore 경로
                  </span>
                  <Badge variant="muted" className="text-[9px] px-1 py-0 h-4 gap-0.5">
                    <Sparkles className="w-2 h-2 text-amber-500" />
                    실시간 동기화
                  </Badge>
                </div>
                <code className="text-xs font-mono font-semibold text-[#3182F6] dark:text-blue-400 block truncate">
                  {firestorePath}
                </code>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyPath}
              className="gap-1 h-8 shrink-0 text-xs px-2.5 ml-auto sm:ml-2"
              title="Firestore 경로 복사"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#4E5968] dark:text-zinc-300" />
                  <span>경로 복사</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 내 개인화 공개 링크 (/[displayName]) 안내 배너 */}
        {user.displayName ? (
          <div className="mt-3 pt-3 border-t border-[#E5E8EB]/70 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#4E5968] dark:text-zinc-300">
                내 공개 링크:
              </span>
              <code className="text-xs font-mono font-bold text-[#3182F6] dark:text-blue-400">
                /{encodeURIComponent(user.displayName)}
              </code>
            </div>

            <Link
              href={`/${encodeURIComponent(user.displayName)}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3182F6] hover:text-[#1B64DA] dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
            >
              <span>내 페이지 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
