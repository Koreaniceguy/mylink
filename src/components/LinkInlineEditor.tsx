"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { LinkIcon, AVAILABLE_ICONS } from "@/components/LinkIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface LinkInlineEditorProps {
  item: LinkItem;
  onSave: (id: string, updated: Partial<Omit<LinkItem, "id">>) => Promise<void>;
  onCancel: () => void;
}

// 도메인에 따른 아이콘 자동 추론 유틸 (LinkDialog와 동일)
function detectIconFromUrl(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes("github.com")) return "github";
  if (lower.includes("velog.io") || lower.includes("tistory.com") || lower.includes("blog"))
    return "book-open";
  if (lower.includes("notion.so") || lower.includes("notion.site")) return "file-text";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("kakao.com") || lower.includes("open.kakao")) return "message-circle";
  if (lower.startsWith("mailto:")) return "mail";
  if (lower.includes("vercel.app") || lower.includes("netlify.app")) return "rocket";
  return null;
}

export function LinkInlineEditor({
  item,
  onSave,
  onCancel,
}: LinkInlineEditorProps) {
  const [title, setTitle] = useState(item.title);
  const [url, setUrl] = useState(item.url);
  const [icon, setIcon] = useState(item.icon || "globe");
  const [isActive, setIsActive] = useState(item.isActive);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setErrorMessage(null);

    // 자동 아이콘 감지
    const detected = detectIconFromUrl(value);
    if (detected && (!icon || icon === "globe")) {
      setIcon(detected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    let trimmedUrl = url.trim();

    // 입력 검증 (추가 모달과 동일)
    if (!trimmedTitle) {
      setErrorMessage("링크 제목을 입력해주세요.");
      return;
    }

    if (!trimmedUrl) {
      setErrorMessage("연결할 웹 주소(URL)를 입력해주세요.");
      return;
    }

    // URL 스킴 자동 보정
    if (
      !trimmedUrl.startsWith("http://") &&
      !trimmedUrl.startsWith("https://") &&
      !trimmedUrl.startsWith("mailto:") &&
      !trimmedUrl.startsWith("tel:")
    ) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave(item.id, {
        title: trimmedTitle,
        url: trimmedUrl,
        icon,
        isActive,
      });
    } catch (err: unknown) {
      console.error("링크 수정 중 오류:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "수정 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-xl border-2 border-[#3182F6]/60 dark:border-blue-500/60 bg-[#F8FAFD] dark:bg-zinc-800/95 shadow-md space-y-3.5 transition-all animate-in fade-in zoom-in-98 duration-150"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E8EB] dark:border-zinc-700">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3182F6]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>링크 인라인 편집</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant={isActive ? "default" : "secondary"} className="text-[10px]">
            {isActive ? "공개 설정됨" : "숨김 상태"}
          </Badge>
        </div>
      </div>

      {/* 에러 메시지 배너 */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-lg border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 제목 및 URL 입력 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#191F28] dark:text-zinc-200 mb-1">
            링크 제목 <span className="text-[#3182F6]">*</span>
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="예: 기술 블로그 & 포트폴리오"
            className="text-xs sm:text-sm bg-white dark:bg-zinc-900"
            autoFocus
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-[#191F28] dark:text-zinc-200">
              연결 URL <span className="text-[#3182F6]">*</span>
            </label>
            <span className="text-[10px] text-[#8B95A1]">https:// 자동 보정</span>
          </div>
          <Input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="예: github.com/user"
            className="text-xs sm:text-sm bg-white dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* 아이콘 선택 & 공개 여부 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-[#4E5968] dark:text-zinc-300">
            아이콘:
          </div>
          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E5E8EB] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#3182F6] transition-colors cursor-pointer text-xs font-medium text-[#191F28] dark:text-white"
          >
            <LinkIcon name={icon} className="w-3.5 h-3.5" />
            <span className="capitalize">{icon}</span>
            <span className="text-[10px] text-[#8B95A1]">
              {showIconPicker ? "▲ 닫기" : "▼ 변경"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#4E5968] dark:text-zinc-300">
            방문자에게 공개
          </span>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      {/* 아이콘 피커 펼침 그리드 */}
      {showIconPicker && (
        <div className="p-2 border border-[#E5E8EB] dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto">
          {AVAILABLE_ICONS.map((ic) => {
            const isSelected = icon === ic.id;
            const IconComp = ic.component;
            return (
              <button
                key={ic.id}
                type="button"
                onClick={() => {
                  setIcon(ic.id);
                  setShowIconPicker(false);
                }}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  isSelected
                    ? "border-[#3182F6] bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] font-bold"
                    : "border-transparent hover:bg-[#F2F4F6] dark:hover:bg-zinc-800 text-[#4E5968] dark:text-zinc-300"
                }`}
              >
                <IconComp className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-[9px] truncate max-w-full">
                  {ic.label.split("/")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 하단 취소 / 저장 버튼 */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E8EB] dark:border-zinc-700">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isSubmitting}
          onClick={onCancel}
          className="gap-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>취소</span>
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-1 shadow-xs cursor-pointer bg-[#3182F6] hover:bg-[#206fe6] text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Firebase 저장 중...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>수정 완료</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
