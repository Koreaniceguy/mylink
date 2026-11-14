"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Database,
  Share2,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export function LoginPrompt() {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const user = await loginWithGoogle();
      if (user) {
        showToast(`${user.displayName || "사용자"}님, 환영합니다! 🎉`, "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <Card className="border-2 border-dashed border-[#E5E8EB] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-8 sm:p-12 flex flex-col items-center text-center">
          {/* 상단 락/클라우드 아이콘 */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#3182F6] to-[#60A5FA] text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Lock className="w-10 h-10 stroke-[2.2]" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md animate-bounce">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* 메인 타이틀 및 뱃지 */}
          <Badge variant="secondary" className="mb-3 px-3 py-1 text-xs font-semibold text-[#3182F6] dark:text-blue-400 bg-[#E8F3FF] dark:bg-blue-950/60">
            Google 계정 연동 필요
          </Badge>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191F28] dark:text-white tracking-tight">
            로그인 후 나만의 마이링크를 만들어보세요
          </h2>

          {/* 설명 문구 */}
          <p className="mt-3 text-sm sm:text-base text-[#4E5968] dark:text-zinc-400 max-w-lg leading-relaxed">
            마이링크는 직장인과 개인을 위한 1분 완성 멀티링크 서비스입니다.
            <br className="hidden sm:inline" />
            Google 계정으로 로그인하면 내 계정 전용 Firestore 클라우드
            <br />
            <code className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-[#F2F4F6] dark:bg-zinc-800 text-[#3182F6] dark:text-blue-400 font-mono text-xs font-semibold">
              users/(user.uid)/links
            </code>
            <br />
            경로에 데이터가 안전하게 저장되어 언제 어디서나 관리할 수 있습니다.
          </p>

          {/* 주요 혜택/기능 3가지 박스 */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-8 text-left">
            <div className="p-4 rounded-2xl bg-[#F9FAFB] dark:bg-zinc-800/50 border border-[#E5E8EB] dark:border-zinc-800">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#3182F6] flex items-center justify-center mb-2.5">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#191F28] dark:text-white flex items-center gap-1">
                개인화 클라우드 저장
              </h4>
              <p className="text-[11px] text-[#8B95A1] mt-1 leading-normal">
                내 UID별 전용 Firestore 경로로 데이터가 영구 보관됩니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FAFB] dark:bg-zinc-800/50 border border-[#E5E8EB] dark:border-zinc-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                <Share2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#191F28] dark:text-white flex items-center gap-1">
                디지털 명함 & 공유
              </h4>
              <p className="text-[11px] text-[#8B95A1] mt-1 leading-normal">
                vCard 연락처 저장 및 원클릭 URL 공유 기능을 지원합니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FAFB] dark:bg-zinc-800/50 border border-[#E5E8EB] dark:border-zinc-800">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#191F28] dark:text-white flex items-center gap-1">
                실시간 클릭 분석
              </h4>
              <p className="text-[11px] text-[#8B95A1] mt-1 leading-normal">
                방문자수 및 링크별 클릭 통계를 실시간으로 추적합니다.
              </p>
            </div>
          </div>

          {/* Google 로그인 큰 CTA 버튼 */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-[#F9FAFB] dark:hover:bg-zinc-700/80 text-[#191F28] dark:text-white border-2 border-[#E5E8EB] dark:border-zinc-700 shadow-sm hover:shadow-md active:scale-[0.98] transition-all font-semibold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#3182F6]" />
                  <span>Google 로그인 진행 중...</span>
                </>
              ) : (
                <>
                  {/* Google 공식 'G' 로고 SVG */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Google 계정으로 시작하기</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-[#8B95A1]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>별도 회원가입 없이 3초 만에 시작할 수 있습니다.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
