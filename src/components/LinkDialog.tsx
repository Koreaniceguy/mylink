/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { LinkItem } from "@/types";
import { LinkIcon, AVAILABLE_ICONS } from "@/components/LinkIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  Plus,
  Pencil,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: LinkItem | null;
  onSave: (data: Omit<LinkItem, "id" | "clicks">) => Promise<void> | void;
}

// 빠른 설정을 위한 추천 프리셋 목록
const QUICK_PRESETS = [
  {
    name: "GitHub",
    title: "GitHub 저장소",
    url: "https://github.com/",
    icon: "github",
  },
  {
    name: "Velog",
    title: "기술 블로그 & 기록",
    url: "https://velog.io/",
    icon: "book-open",
  },
  {
    name: "Notion",
    title: "온라인 이력서 & 포트폴리오",
    url: "https://notion.so/",
    icon: "file-text",
  },
  {
    name: "LinkedIn",
    title: "LinkedIn 프로필",
    url: "https://linkedin.com/in/",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    title: "인스타그램",
    url: "https://instagram.com/",
    icon: "instagram",
  },
  {
    name: "커피챗",
    title: "1:1 커피챗 & 오픈채팅",
    url: "https://open.kakao.com/o/",
    icon: "message-circle",
  },
  {
    name: "데모 웹",
    title: "최신 토이 프로젝트 데모",
    url: "https://",
    icon: "rocket",
  },
];

// 도메인에 따른 아이콘 자동 추론 유틸
function detectIconFromUrl(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes("github.com")) return "github";
  if (lower.includes("velog.io") || lower.includes("tistory.com") || lower.includes("blog")) return "book-open";
  if (lower.includes("notion.so") || lower.includes("notion.site")) return "file-text";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("kakao.com") || lower.includes("open.kakao")) return "message-circle";
  if (lower.startsWith("mailto:")) return "mail";
  if (lower.includes("vercel.app") || lower.includes("netlify.app")) return "rocket";
  return null;
}

export function LinkDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: LinkDialogProps) {
  const isEditing = !!initialData;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("globe");
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달이 열리거나 대상 데이터가 바뀔 때 초기화
  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title);
        setUrl(initialData.url);
        setIcon(initialData.icon || "globe");
        setIsActive(initialData.isActive);
      } else {
        setTitle("");
        setUrl("");
        setIcon("globe");
        setIsActive(true);
      }
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [open, initialData]);

  // URL 입력 시 도메인 감지하여 아이콘 자동 제안
  const handleUrlChange = (value: string) => {
    setUrl(value);
    setErrorMessage(null);

    // 사용자가 직접 아이콘을 고르지 않은 상태이거나 기본값일 때 스마트 감지
    const detected = detectIconFromUrl(value);
    if (detected && (!icon || icon === "globe")) {
      setIcon(detected);
    }
  };

  // 프리셋 선택 핸들러
  const handleApplyPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setTitle(preset.title);
    setUrl(preset.url);
    setIcon(preset.icon);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    let trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setErrorMessage("링크 제목을 입력해주세요.");
      return;
    }

    if (!trimmedUrl) {
      setErrorMessage("연결할 웹 주소(URL)를 입력해주세요.");
      return;
    }

    // URL 스킴 자동 보정 (http, https, mailto 등이 없으면 https:// 자동 부가)
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
      await onSave({
        title: trimmedTitle,
        url: trimmedUrl,
        icon,
        isActive,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("링크 저장 중 오류:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center shrink-0">
              {isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">
                {isEditing ? "링크 수정하기" : "새 링크 추가하기"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEditing
                  ? "등록된 링크의 정보와 공개 여부를 수정합니다."
                  : "프로필 명함에 노출될 새로운 링크를 추가하고 로컬에 바로 저장합니다."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 에러 피드백 배너 */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mt-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-200 dark:border-rose-900">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 신규 생성 시 추천 프리셋 (TDS Quick Template) */}
        {!isEditing && (
          <div className="mt-4 p-3 bg-[#F9FAFB] dark:bg-zinc-800/40 rounded-2xl border border-[#F2F4F6] dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>자주 쓰는 링크 빠른 채우기</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-zinc-800 hover:bg-[#E8F3FF] dark:hover:bg-blue-950/50 hover:text-[#3182F6] text-[#4E5968] dark:text-zinc-200 border border-[#E5E8EB] dark:border-zinc-700 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  <LinkIcon name={preset.icon} className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* 제목 입력 */}
          <div>
            <label className="block text-xs font-bold text-[#191F28] dark:text-zinc-200 mb-1.5">
              버튼 이름 / 제목 <span className="text-[#3182F6]">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="예: 온라인 이력서 & 포트폴리오"
              className="text-xs sm:text-sm"
              autoFocus={!isEditing}
            />
          </div>

          {/* URL 입력 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#191F28] dark:text-zinc-200">
                연결 URL (웹 주소) <span className="text-[#3182F6]">*</span>
              </label>
              <span className="text-[10px] text-[#8B95A1]">
                https:// 자동 보정 지원
              </span>
            </div>
            <Input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="예: notion.so/my-portfolio 또는 https://velog.io/@user"
              className="text-xs sm:text-sm"
            />
          </div>

          {/* 아이콘 선택기 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#191F28] dark:text-zinc-200">
                아이콘 선택
              </label>
              <span className="text-[10px] text-[#8B95A1]">
                총 {AVAILABLE_ICONS.length}개 지원
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 border border-[#E5E8EB] dark:border-zinc-800 rounded-xl bg-[#F9FAFB]/50 dark:bg-zinc-900/30">
              {AVAILABLE_ICONS.map((ic) => {
                const isSelected = icon === ic.id;
                const IconComp = ic.component;
                return (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setIcon(ic.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#3182F6] bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] shadow-xs ring-1 ring-[#3182F6]/30 font-bold"
                        : "border-transparent bg-white dark:bg-zinc-800/80 hover:bg-[#F2F4F6] dark:hover:bg-zinc-700/60 text-[#4E5968] dark:text-zinc-300"
                    }`}
                  >
                    <IconComp className="w-4 h-4 mb-1" />
                    <span className="text-[10px] truncate max-w-full">
                      {ic.label.split("/")[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 실시간 미리보기 카드 (Live Preview in Modal) */}
          <div>
            <label className="block text-xs font-bold text-[#191F28] dark:text-zinc-200 mb-1.5">
              미리보기 (실제 표시될 카드 형태)
            </label>
            <div
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                isActive
                  ? "bg-white dark:bg-zinc-800 border-[#E5E8EB] dark:border-zinc-700 shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-900 border-dashed border-[#E5E8EB] dark:border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#F2F4F6] dark:bg-zinc-700 flex items-center justify-center text-[#191F28] dark:text-white shrink-0">
                  <LinkIcon name={icon} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[#191F28] dark:text-white truncate">
                    {title.trim() || "버튼 이름 미리보기"}
                  </span>
                  <span className="block text-[10px] text-[#8B95A1] truncate">
                    {url.trim() ? url.trim().replace(/^https?:\/\//, "") : "example.com"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Badge variant={isActive ? "default" : "secondary"} className="text-[10px]">
                  {isActive ? "공개" : "숨김"}
                </Badge>
                <ExternalLink className="w-3.5 h-3.5 text-[#8B95A1]" />
              </div>
            </div>
          </div>

          {/* 공개 여부 토글 */}
          <div className="flex items-center justify-between p-3.5 bg-[#F9FAFB] dark:bg-zinc-800/60 rounded-2xl border border-[#F2F4F6] dark:border-zinc-800">
            <div>
              <div className="text-xs font-bold text-[#191F28] dark:text-zinc-200">
                프로필 화면에 즉시 공개
              </div>
              <p className="text-[11px] text-[#8B95A1] mt-0.5">
                체크 해제 시 방문자 화면에서 숨겨집니다.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 shadow-xs"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "수정 저장" : "새 링크 추가"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
