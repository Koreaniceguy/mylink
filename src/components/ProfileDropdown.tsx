"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { useToast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Copy,
  Check,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

interface ProfileDropdownProps {
  user: User;
  onLogout: () => Promise<void>;
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const displayName = user.displayName || "사용자";
  const userProfilePath = `/${encodeURIComponent(displayName)}`;

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyProfileUrl = () => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${userProfilePath}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      showToast("내 개인 페이지 링크가 복사되었습니다! 🔗", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNavigateToMyPage = () => {
    setIsOpen(false);
    router.push(userProfilePath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 프로필 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-[#F2F4F6] dark:hover:bg-zinc-800 transition-all cursor-pointer border border-transparent hover:border-[#E5E8EB] dark:hover:border-zinc-700 active:scale-[0.98]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-[#E5E8EB] dark:border-zinc-700"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center font-bold text-xs">
            {displayName.slice(0, 1)}
          </div>
        )}

        <span className="text-xs font-semibold text-[#191F28] dark:text-white max-w-[100px] truncate hidden sm:inline">
          {displayName}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8B95A1] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#3182F6]" : ""
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 팝오버 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E5E8EB] dark:border-zinc-800 shadow-xl shadow-black/5 z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          {/* 헤더: 사용자 정보 */}
          <div className="p-3 bg-[#F9FAFB] dark:bg-zinc-800/60 rounded-xl mb-1.5">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E8EB] dark:border-zinc-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center font-bold text-sm">
                  {displayName.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#191F28] dark:text-white truncate">
                    {displayName}
                  </span>
                  <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-[#3182F6]">
                    내 프로필
                  </Badge>
                </div>
                <p className="text-[11px] text-[#8B95A1] truncate mt-0.5">
                  {user.email || "Google 로그인"}
                </p>
              </div>
            </div>
          </div>

          {/* 메뉴 목록 */}
          <div className="space-y-1">
            {/* 1. 내 개인별 페이지 이동 (핵심 요구사항) */}
            <button
              type="button"
              onClick={handleNavigateToMyPage}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#191F28] dark:text-zinc-100 hover:bg-[#E8F3FF] hover:text-[#3182F6] dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#3182F6]/10 text-[#3182F6] flex items-center justify-center group-hover:bg-[#3182F6] group-hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="font-bold flex items-center gap-1">
                    <span>내 페이지 바로가기</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <span className="text-[10px] text-[#8B95A1] font-mono group-hover:text-[#3182F6]/80">
                    {userProfilePath}
                  </span>
                </div>
              </div>
            </button>

            {/* 2. 내 주소 복사 */}
            <button
              type="button"
              onClick={handleCopyProfileUrl}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#4E5968] dark:text-zinc-300 hover:bg-[#F2F4F6] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-300 flex items-center justify-center">
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
                <span>내 링크 주소 복사</span>
              </div>
              {copied && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  복사됨
                </span>
              )}
            </button>

            {/* 3. 에디터 홈 이동 */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#4E5968] dark:text-zinc-300 hover:bg-[#F2F4F6] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-300 flex items-center justify-center">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                </div>
                <span>에디터 & 대시보드</span>
              </div>
            </Link>
          </div>

          <div className="my-1.5 border-t border-[#F2F4F6] dark:border-zinc-800" />

          {/* 로그아웃 버튼 */}
          <button
            type="button"
            onClick={async () => {
              setIsOpen(false);
              await onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-100/50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
              <LogOut className="w-3.5 h-3.5" />
            </div>
            <span>로그아웃</span>
          </button>
        </div>
      )}
    </div>
  );
}
