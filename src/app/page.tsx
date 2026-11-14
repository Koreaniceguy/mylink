"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { ToastProvider } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { ProfileEditor } from "@/components/ProfileEditor";
import { ThemeSelector } from "@/components/ThemeSelector";
import { LinkListEditor } from "@/components/LinkListEditor";
import { MobilePreview } from "@/components/MobilePreview";
import { VisitorView } from "@/components/VisitorView";
import { UserInfoCard } from "@/components/UserInfoCard";
import { LoginPrompt } from "@/components/LoginPrompt";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useMyLinkStore } from "@/store/useMyLinkStore";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Home() {
  const [viewMode, setViewMode] = useState<"split" | "visitor">("split");
  const mounted = useMounted();
  const { user, loading } = useAuth();
  const { setCurrentUserId, fetchUserLinks } = useMyLinkStore();

  useEffect(() => {
    if (user?.uid) {
      setCurrentUserId(user.uid);
      fetchUserLinks(user.uid);
    } else {
      setCurrentUserId(null);
    }
  }, [user, setCurrentUserId, fetchUserLinks]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3182F6] animate-pulse" />
          <span className="text-xs font-semibold text-[#8B95A1]">
            마이링크를 불러오는 중입니다...
          </span>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F2F4F6] dark:bg-[#111317] text-[#191F28] dark:text-[#F9FAFB] flex flex-col font-sans transition-colors">
        {/* 네비게이션 헤더 */}
        <Navbar viewMode={viewMode} setViewMode={setViewMode} />

        {/* 뷰 모드에 따른 렌더링 */}
        {viewMode === "visitor" ? (
          <VisitorView />
        ) : (
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {!user ? (
              /* 비로그인 상태: 로그인 안내 컴포넌트 */
              <LoginPrompt />
            ) : (
              /* 로그인 상태: 유저 정보/경로 카드 + 에디터 + 모바일 프리뷰 */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 좌측: 편집 패널 (Editor Panel - 7 columns) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* 현재 로그인 유저 정보 & 개인화 Firestore 경로 카드 */}
                  <UserInfoCard />

                  {/* 실시간 통계 요약 */}
                  <StatsCard />

                  {/* 1. 기본 프로필 & 소셜 연락처 편집 */}
                  <ProfileEditor />

                  {/* 2. 테마 스타일 선택기 */}
                  <ThemeSelector />

                  {/* 3. 링크 목록 관리 (Firestore users/(uid)/links 연동) */}
                  <LinkListEditor />
                </div>

                {/* 우측: 실시간 모바일 목업 프리뷰 (5 columns - Sticky) */}
                <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#191F28] dark:text-white">
                        실시간 모바일 미리보기
                      </span>
                      <Badge variant="secondary">Live Preview</Badge>
                    </div>
                    <span className="text-[11px] text-[#8B95A1]">
                      수정 사항이 즉시 반영됩니다
                    </span>
                  </div>

                  <MobilePreview />
                </div>
              </div>
            )}
          </main>
        )}
      </div>
    </ToastProvider>
  );
}
