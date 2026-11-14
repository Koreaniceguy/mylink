"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F2F4F6] dark:bg-[#111317] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[#E5E8EB] dark:border-zinc-800 shadow-xl shadow-black/5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#F2F4F6] dark:bg-zinc-800 text-[#8B95A1] mb-2 font-mono">
          404 Not Found
        </span>

        <h1 className="text-2xl font-black text-[#191F28] dark:text-white tracking-tight mb-2">
          사용자를 찾을 수 없습니다
        </h1>

        <p className="text-sm text-[#4E5968] dark:text-zinc-400 mb-8 leading-relaxed">
          요청하신 프로필 페이지의 사용자가 존재하지 않거나 주소가 변경되었습니다.
          입력하신 영문/한글 닉네임을 다시 확인해주세요.
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
