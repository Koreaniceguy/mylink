"use client";

import React, { useState } from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Link2,
  RotateCcw,
  Sparkles,
  Share2,
  Eye,
  Edit3,
  AlertTriangle,
} from "lucide-react";

interface NavbarProps {
  viewMode: "split" | "visitor";
  setViewMode: (mode: "split" | "visitor") => void;
}

export function Navbar({ viewMode, setViewMode }: NavbarProps) {
  const { loadSampleData, resetToDefault } = useMyLinkStore();
  const { showToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleCopyShareUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 링크가 클립보드에 복사되었습니다! 🎉", "success");
    }
  };

  const handleLoadSample = () => {
    loadSampleData();
    showToast("샘플 프로필 및 링크 데이터를 불러왔습니다.", "info");
  };

  const handleReset = () => {
    resetToDefault();
    setShowResetConfirm(false);
    showToast("모든 데이터가 초기화되었습니다.", "info");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* 로고 & 타이틀 */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3182F6] flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Link2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#191F28] dark:text-white">
                  MyLink
                </span>
                <Badge variant="secondary">TDS v1.1</Badge>
              </div>
              <p className="text-[11px] text-[#8B95A1] hidden sm:block">
                1분 만에 완성하는 직장인 멀티링크
              </p>
            </div>
          </div>

          {/* 뷰 모드 전환 토글 (Split vs Visitor) */}
          <div className="flex items-center bg-[#F2F4F6] dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "split"
                  ? "bg-white dark:bg-zinc-900 text-[#191F28] dark:text-white shadow-xs"
                  : "text-[#8B95A1] hover:text-[#191F28] dark:hover:text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">에디터 & 프리뷰</span>
              <span className="sm:hidden">편집</span>
            </button>
            <button
              onClick={() => setViewMode("visitor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "visitor"
                  ? "bg-white dark:bg-zinc-900 text-[#3182F6] dark:text-blue-400 shadow-xs"
                  : "text-[#8B95A1] hover:text-[#191F28] dark:hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">방문자 화면 보기</span>
              <span className="sm:hidden">방문자</span>
            </button>
          </div>

          {/* 액션 버튼 그룹 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoadSample}
              title="표준 샘플 데이터 불러오기"
              className="gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">샘플 불러오기</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              title="데이터 초기화"
              className="gap-1 text-[#8B95A1] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">초기화</span>
            </Button>

            <Button
              size="sm"
              onClick={handleCopyShareUrl}
              className="gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>공유하기</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 리셋 확인 모달 (shadcn/ui Dialog) */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent onClose={() => setShowResetConfirm(false)} className="max-w-sm">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogHeader>
            <DialogTitle>모든 데이터를 초기화하시겠습니까?</DialogTitle>
            <DialogDescription>
              작성한 프로필 정보와 링크 목록이 모두 삭제되며 빈 상태가 됩니다.
              언제든 상단의 '샘플 불러오기'로 다시 채울 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowResetConfirm(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
            >
              초기화 실행
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
