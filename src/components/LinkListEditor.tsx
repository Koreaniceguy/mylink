"use client";

import React, { useState } from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { LinkItem } from "@/types";
import { LinkIcon } from "@/components/LinkIcon";
import { LinkDialog } from "@/components/LinkDialog";
import { LinkInlineEditor } from "@/components/LinkInlineEditor";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { useToast } from "@/components/Toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Link as LinkSymbol,
  Plus,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  ExternalLink,
  MousePointerClick,
} from "lucide-react";

export function LinkListEditor() {
  const { links, addLink, updateLink, deleteLink, moveLink, toggleLinkActive } =
    useMyLinkStore();
  const { showToast } = useToast();

  // 신규 링크 추가 다이얼로그 상태
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 인라인 수정 중인 링크 ID 상태
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // 삭제 확인 모달 상태
  const [deleteTargetLink, setDeleteTargetLink] = useState<LinkItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  // 신규 링크 저장 핸들러 (Firestore 연동)
  const handleAddLink = async (data: Omit<LinkItem, "id" | "clicks">) => {
    try {
      await addLink(data);
      showToast(`'${data.title}' 새 링크가 Firestore에 저장되었습니다! ✨`, "success");
    } catch (error) {
      console.error("링크 저장 실패:", error);
      showToast("링크 저장 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      throw error;
    }
  };

  // 인라인 링크 수정 저장 핸들러 (Firestore 연동)
  const handleInlineSave = async (
    id: string,
    updated: Partial<Omit<LinkItem, "id">>
  ) => {
    try {
      await updateLink(id, updated);
      setEditingLinkId(null);
      showToast(`'${updated.title || "링크"}' 정보가 수정되었습니다! 🔄`, "success");
    } catch (error) {
      console.error("링크 수정 실패:", error);
      showToast("링크 수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      throw error;
    }
  };

  // 삭제 모달 열기 핸들러
  const openDeleteModal = (item: LinkItem) => {
    setDeleteTargetLink(item);
    setIsDeleteModalOpen(true);
  };

  // 삭제 확인 모달의 실제 삭제 핸들러 (Firestore 연동)
  const handleConfirmDelete = async (id: string) => {
    try {
      const targetTitle = deleteTargetLink?.title || "링크";
      await deleteLink(id);
      showToast(`'${targetTitle}' 링크가 삭제되었습니다.`, "info");
    } catch (error) {
      console.error("링크 삭제 실패:", error);
      showToast("링크 삭제 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      throw error;
    }
  };

  return (
    <Card>
      {/* 헤더 */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center">
              <LinkSymbol className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>링크 목록 관리</CardTitle>
                <Badge variant="secondary">{links.length}개</Badge>
              </div>
              <CardDescription>
                인라인 편집, 삭제 모달, 노출 여부 토글 및 순서 변경
              </CardDescription>
            </div>
          </div>

          <Button onClick={openAddDialog} size="sm" className="gap-1.5 shadow-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>새 링크 추가</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* 링크 목록 */}
        {links.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-[#E5E8EB] dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-6 bg-[#F9FAFB]/50 dark:bg-zinc-900/30">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F3FF] dark:bg-blue-950/50 text-[#3182F6] flex items-center justify-center mb-3">
              <LinkSymbol className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#191F28] dark:text-white">
              등록된 링크가 없습니다
            </p>
            <p className="text-xs text-[#8B95A1] mt-1 max-w-xs">
              포트폴리오, SNS, 기술 블로그 등 사람들과 공유하고 싶은 링크를 등록해보세요.
            </p>
            <Button
              onClick={openAddDialog}
              size="sm"
              className="mt-4 gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>지금 새 링크 추가하기</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((item, index) => {
              // 현재 항목이 인라인 편집 중인 경우 인라인 에디터 표시
              if (editingLinkId === item.id) {
                return (
                  <LinkInlineEditor
                    key={item.id}
                    item={item}
                    onSave={handleInlineSave}
                    onCancel={() => setEditingLinkId(null)}
                  />
                );
              }

              // 일반 카드 뷰: 수정 및 삭제 버튼 항상 표시
              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                    item.isActive
                      ? "bg-white dark:bg-zinc-800/80 border-[#E5E8EB] dark:border-zinc-700 hover:border-[#3182F6]/50 shadow-xs"
                      : "bg-[#F9FAFB] dark:bg-zinc-900/60 border-dashed border-[#E5E8EB] dark:border-zinc-800 opacity-70"
                  }`}
                >
                  {/* 왼쪽: 순서조절 + 아이콘 + 텍스트 */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* 위/아래 순서 이동 버튼 */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveLink(item.id, "up")}
                        className="p-1 rounded text-[#8B95A1] hover:text-[#191F28] dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-zinc-700 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="위로 이동"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === links.length - 1}
                        onClick={() => moveLink(item.id, "down")}
                        className="p-1 rounded text-[#8B95A1] hover:text-[#191F28] dark:hover:text-white hover:bg-[#F2F4F6] dark:hover:bg-zinc-700 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                        title="아래로 이동"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* 링크 아이콘 */}
                    <div className="w-9 h-9 rounded-xl bg-[#F2F4F6] dark:bg-zinc-700 flex items-center justify-center text-[#191F28] dark:text-white shrink-0">
                      <LinkIcon name={item.icon} className="w-4 h-4" />
                    </div>

                    {/* 타이틀 및 URL */}
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#191F28] dark:text-white truncate">
                          {item.title}
                        </span>
                        {/* 클릭 통계 뱃지 */}
                        <Badge variant="muted" className="gap-0.5 shrink-0 text-[10px]">
                          <MousePointerClick className="w-2.5 h-2.5" />
                          {item.clicks || 0}
                        </Badge>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#8B95A1] hover:text-[#3182F6] truncate flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>

                  {/* 오른쪽: 활성 토글 Switch + 항상 표시되는 수정/삭제 버튼 */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F2F4F6] dark:border-zinc-800">
                    {/* shadcn/ui Switch 토글 */}
                    <div className="flex items-center gap-1.5 mr-1">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() => toggleLinkActive(item.id)}
                        title={
                          item.isActive
                            ? "공개 상태 (클릭하여 숨김)"
                            : "숨김 상태 (클릭하여 공개)"
                        }
                      />
                      <span className="text-[11px] text-[#8B95A1] sm:hidden">
                        {item.isActive ? "공개" : "숨김"}
                      </span>
                    </div>

                    {/* 항상 표시되는 수정 버튼 */}
                    <button
                      type="button"
                      onClick={() => setEditingLinkId(item.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#4E5968] dark:text-zinc-200 bg-[#F2F4F6] dark:bg-zinc-700/80 hover:bg-[#E8F3FF] dark:hover:bg-blue-950/60 hover:text-[#3182F6] border border-[#E5E8EB] dark:border-zinc-600 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="인라인 수정"
                    >
                      <Pencil className="w-3 h-3 text-[#3182F6]" />
                      <span>수정</span>
                    </button>

                    {/* 항상 표시되는 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => openDeleteModal(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* 신규 링크 추가 다이얼로그 (shadcn/ui Dialog) */}
      <LinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddLink}
      />

      {/* 링크 삭제 확인 모달 */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        link={deleteTargetLink}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}
