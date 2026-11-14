"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileDropdown } from "@/components/ProfileDropdown";
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
  ExternalLink,
} from "lucide-react";

interface NavbarProps {
  viewMode: "split" | "visitor";
  setViewMode: (mode: "split" | "visitor") => void;
}

export function Navbar({ viewMode, setViewMode }: NavbarProps) {
  const { loadSampleData, resetToDefault } = useMyLinkStore();
  const { user, loginWithGoogle, logout } = useAuth();
  const { showToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const loggedInUser = await loginWithGoogle();
      if (loggedInUser) {
        showToast(`${loggedInUser.displayName || "사용자"}님 환영합니다! 🎉`, "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("성공적으로 로그아웃되었습니다.", "info");
    } catch (error) {
      console.error(error);
      showToast("로그아웃 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* 로고 & 타이틀 */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#3182F6] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
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
          </Link>

          {/* 뷰 모드 전환 토글 (Split vs Visitor) */}
          <div className="flex items-center bg-[#F2F4F6] dark:bg-zinc-800 p-1 rounded-xl shrink-0">
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

          {/* 액션 버튼 그룹 & Google 로그인 영역 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 로그인 상태에 따른 버튼 */}
            {user ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLoadSample}
                title="표준 샘플 데이터 불러오기"
                className="gap-1.5 hidden md:flex"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>샘플 불러오기</span>
              </Button>
            ) : null}

            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                title="데이터 초기화"
                className="gap-1 text-[#8B95A1] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 hidden md:flex"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>초기화</span>
              </Button>
            ) : null}

            {/* 헤더 개인별 페이지 바로가기 버튼 */}
            {user ? (
              <Link
                href={`/${encodeURIComponent(user.displayName || "user")}`}
                className="inline-flex"
              >
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1.5 shadow-xs bg-[#3182F6] hover:bg-[#1B64DA] text-white"
                  title="내 개인 페이지로 이동"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">내 페이지</span>
                  <span className="sm:hidden">내 링크</span>
                </Button>
              </Link>
            ) : null}

            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopyShareUrl}
              className="gap-1.5 shadow-xs"
              title="현재 링크 복사"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">공유하기</span>
            </Button>

            {/* Google 로그인 / 사용자 프로필 드롭다운 */}
            {user ? (
              <div className="flex items-center pl-1 sm:pl-2 border-l border-[#E5E8EB] dark:border-zinc-800">
                <ProfileDropdown user={user} onLogout={handleLogout} />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-[#F9FAFB] dark:hover:bg-zinc-700/80 text-[#191F28] dark:text-white border border-[#E5E8EB] dark:border-zinc-700 shadow-2xs text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {/* Google 컬러 G 아이콘 */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google 로그인</span>
              </button>
            )}
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
              언제든 상단의 &lsquo;샘플 불러오기&rsquo;로 다시 채울 수 있습니다.
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
