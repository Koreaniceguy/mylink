"use client";

import React, { useRef } from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Upload,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
];

export function ProfileEditor() {
  const { profile, contact, updateProfile, updateContact } = useMyLinkStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          updateProfile("avatarUrl", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="space-y-6">
      {/* 1. 기본 프로필 정보 */}
      <div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>기본 프로필 정보</CardTitle>
              <CardDescription>
                명함 메인에 노출되는 프로필 정보입니다.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 아바타 선택 및 업로드 */}
          <div>
            <label className="block text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-2">
              프로필 사진
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#F2F4F6] dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 shadow-sm shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name || "프로필"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#8B95A1]">
                    {profile.name ? profile.name.slice(0, 2) : "ME"}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateProfile("avatarUrl", preset)}
                      className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${
                        profile.avatarUrl === preset
                          ? "ring-2 ring-[#3182F6] scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={preset} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>사진 업로드</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {profile.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => updateProfile("avatarUrl", "")}
                      className="text-[11px] text-[#8B95A1] hover:text-rose-500 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>

                <Input
                  type="text"
                  placeholder="이미지 URL 직접 입력 (https://...)"
                  value={profile.avatarUrl}
                  onChange={(e) => updateProfile("avatarUrl", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 이름 & 직함 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-1.5">
                이름 <span className="text-[#3182F6]">*</span>
              </label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                placeholder="예: 홍길동"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-1.5">
                직함 / 소속
              </label>
              <Input
                type="text"
                value={profile.role}
                onChange={(e) => updateProfile("role", e.target.value)}
                placeholder="예: Product Designer @ Acme Corp"
              />
            </div>
          </div>

          {/* 한 줄 소개 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#4E5968] dark:text-zinc-300">
                한 줄 소개
              </label>
              <span className="text-[11px] text-[#8B95A1]">
                {profile.bio.length}/100자
              </span>
            </div>
            <Textarea
              value={profile.bio}
              maxLength={100}
              rows={2}
              onChange={(e) => updateProfile("bio", e.target.value)}
              placeholder="나를 소개하는 한 줄 문장을 작성해보세요."
            />
          </div>
        </CardContent>
      </div>

      {/* 2. 소셜 & 연락처 설정 */}
      <div>
        <CardHeader className="border-t border-[#F2F4F6] dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8F3FF] dark:bg-blue-950/60 text-[#3182F6] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>소셜 및 연락처 (명함 정보)</CardTitle>
              <CardDescription>
                입력 시 프로필 상단에 전용 아이콘이 자동 표시되며 vCard에 포함됩니다.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-[#3182F6]" />
                이메일
              </label>
              <Input
                type="email"
                value={contact.email || ""}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="user@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                전화번호
              </label>
              <Input
                type="tel"
                value={contact.phone || ""}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="010-1234-5678"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-sky-600" />
                LinkedIn URL
              </label>
              <Input
                type="url"
                value={contact.linkedin || ""}
                onChange={(e) => updateContact("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-200" />
                GitHub URL
              </label>
              <Input
                type="url"
                value={contact.github || ""}
                onChange={(e) => updateContact("github", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>

            {/* Instagram */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#4E5968] dark:text-zinc-300 mb-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                Instagram URL
              </label>
              <Input
                type="url"
                value={contact.instagram || ""}
                onChange={(e) => updateContact("instagram", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
