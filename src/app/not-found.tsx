"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Home, Loader2, UserX } from "lucide-react";
import { getUserByDisplayName, UserDocumentData } from "@/lib/userService";
import { getActiveLinksFromFirestore } from "@/lib/linksService";
import { PublicVisitorView } from "@/components/PublicVisitorView";
import { LinkItem } from "@/types";

export default function NotFound() {
  const [isResolving, setIsResolving] = useState(true);
  const [matchedUser, setMatchedUser] = useState<UserDocumentData | null>(null);
  const [matchedLinks, setMatchedLinks] = useState<LinkItem[]>([]);
  const [searchedName, setSearchedName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const pathname = window.location.pathname;
      // basePath (/mylink) 제거 및 정리
      let cleanPath = pathname;
      if (cleanPath.startsWith("/mylink")) {
        cleanPath = cleanPath.slice(7);
      }
      
      // 슬래시 기준 세그먼트 분리
      const segments = cleanPath.split("/").filter(Boolean);

      // 세그먼트가 1개이고 시스템 예약어가 아닌 경우 (예: /mylink/승준 -> segments: ['승준'])
      const reservedPaths = ["404", "not-found", "_next", "favicon.ico", "api"];
      if (segments.length === 1 && !reservedPaths.includes(segments[0])) {
        const rawSlug = segments[0];
        const decodedSlug = decodeURIComponent(rawSlug).trim();

        if (decodedSlug) {
          setSearchedName(decodedSlug);

          // Firestore에서 해당 displayName 또는 profile.name 또는 UID 검색
          getUserByDisplayName(decodedSlug)
            .then(async (user) => {
              if (user) {
                setMatchedUser(user);
                try {
                  const links = await getActiveLinksFromFirestore(user.uid);
                  setMatchedLinks(links || []);
                } catch (linkError) {
                  console.error("링크 목록 조회 오류:", linkError);
                  setMatchedLinks([]);
                }
              }
            })
            .catch((err) => {
              console.error("동적 프로필 조회 실패:", err);
            })
            .finally(() => {
              setIsResolving(false);
            });
          return;
        }
      }
    } catch (e) {
      console.error("Path 파싱 오류:", e);
    }

    setIsResolving(false);
  }, []);

  // 1. URL로부터 사용자 프로필을 조회 중일 때 로딩 화면
  if (isResolving) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] dark:bg-[#111317] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3.5 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[#E5E8EB] dark:border-zinc-800 shadow-xl shadow-black/5 text-center max-w-sm w-full">
          <Loader2 className="w-9 h-9 text-[#3182F6] animate-spin" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#191F28] dark:text-white">
              {searchedName ? `‘${searchedName}’ 님의 프로필을 찾는 중입니다...` : "페이지를 불러오는 중입니다..."}
            </h3>
            <p className="text-xs text-[#8B95A1]">
              잠시만 기다려주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. 사용자를 성공적으로 찾았을 때 -> 동적 프로필 화면 렌더링!
  if (matchedUser) {
    return (
      <main>
        <PublicVisitorView user={matchedUser} initialLinks={matchedLinks} />
      </main>
    );
  }

  // 3. 사용자를 찾지 못했거나 일반 404인 경우
  return (
    <div className="min-h-screen bg-[#F2F4F6] dark:bg-[#111317] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[#E5E8EB] dark:border-zinc-800 shadow-xl shadow-black/5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center mb-5">
          {searchedName ? <UserX className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#F2F4F6] dark:bg-zinc-800 text-[#8B95A1] mb-2 font-mono">
          404 Not Found
        </span>

        <h1 className="text-2xl font-black text-[#191F28] dark:text-white tracking-tight mb-2">
          {searchedName ? `‘${searchedName}’ 사용자를 찾을 수 없습니다` : "페이지를 찾을 수 없습니다"}
        </h1>

        <p className="text-sm text-[#4E5968] dark:text-zinc-400 mb-8 leading-relaxed break-keep">
          {searchedName ? (
            <>
              요청하신 <strong>‘{searchedName}’</strong> 님의 프로필이 존재하지 않거나 주소가 변경되었습니다.
              <br />
              Google 로그인 후 나만의 프로필을 생성해보세요!
            </>
          ) : (
            <>
              요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다.
              <br />
              입력하신 주소를 다시 확인해주세요.
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#3182F6] hover:bg-[#1B64DA] text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>메인으로 이동</span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-[#F2F4F6] hover:bg-[#E5E8EB] dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#191F28] dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전 페이지</span>
          </button>
        </div>
      </div>
    </div>
  );
}
