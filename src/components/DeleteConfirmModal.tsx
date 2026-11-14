"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types";
import { LinkIcon } from "@/components/LinkIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkItem | null;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  link,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!link) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(link.id);
      onOpenChange(false);
    } catch (error) {
      console.error("링크 삭제 실패:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isDeleting ? () => {} : onOpenChange}>
      <DialogContent
        onClose={isDeleting ? undefined : () => onOpenChange(false)}
        className="max-w-md p-6"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 ring-4 ring-rose-50/50 dark:ring-rose-950/20">
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-[#191F28] dark:text-white">
                정말 삭제하시겠습니까?
              </DialogTitle>
              <p className="text-xs text-[#8B95A1] mt-0.5">
                선택한 링크가 영구적으로 삭제됩니다.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* 삭제 대상 링크 정보 표시 */}
        <div className="mt-4 p-3.5 rounded-xl border border-[#E5E8EB] dark:border-zinc-800 bg-[#F9FAFB] dark:bg-zinc-800/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-700 border border-[#E5E8EB] dark:border-zinc-600 flex items-center justify-center text-[#191F28] dark:text-white shrink-0">
            <LinkIcon name={link.icon} className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[#191F28] dark:text-white truncate">
              {link.title}
            </div>
            <div className="text-[11px] text-[#8B95A1] truncate mt-0.5">
              {link.url}
            </div>
          </div>
        </div>

        {/* 빨간색 경고 문구 */}
        <div className="mt-3 px-1">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        {/* 액션 버튼 */}
        <DialogFooter className="mt-6 gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 shadow-xs cursor-pointer border-transparent"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제하기</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
