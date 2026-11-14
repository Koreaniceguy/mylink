"use client";

import React from "react";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { THEME_CONFIGS } from "@/lib/themeStyles";
import { LinkIcon } from "@/components/LinkIcon";
import { downloadVCard } from "@/lib/vcard";
import { useToast } from "@/components/Toast";
import {
  Mail,
  Phone,
  UserPlus,
  ChevronRight,
  Sparkles,
  MousePointerClick,
  Share2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";

export function MobilePreview() {
  const { profile, contact, links, theme, incrementLinkClick } = useMyLinkStore();
  const { showToast } = useToast();

  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS["minimal-light"];
  const activeLinks = links.filter((l) => l.isActive);

  const handleLinkClick = (id: string, url: string, e: React.MouseEvent) => {
    e.preventDefault();
    incrementLinkClick(id);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadVCard = () => {
    downloadVCard(profile, contact);
    showToast("연락처(vCard) 파일이 다운로드되었습니다! 📇", "success");
  };

  const hasAnySocial =
    contact.email ||
    contact.phone ||
    contact.linkedin ||
    contact.github ||
    contact.instagram;

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* 모바일 목업 외곽 프레임 (iPhone Frame) */}
      <div className="w-[340px] sm:w-[370px] min-h-[720px] max-h-[820px] bg-black p-3.5 rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-zinc-800 relative flex flex-col">
        {/* 볼륨 버튼 & 전원 버튼 시뮬레이션 */}
        <div className="absolute -left-[5px] top-28 w-[3px] h-10 bg-zinc-700 rounded-l-sm" />
        <div className="absolute -left-[5px] top-42 w-[3px] h-10 bg-zinc-700 rounded-l-sm" />
        <div className="absolute -right-[5px] top-32 w-[3px] h-14 bg-zinc-700 rounded-r-sm" />

        {/* 스마트폰 화면 컨테이너 */}
        <div
          className={`w-full flex-1 rounded-[38px] overflow-y-auto no-scrollbar relative flex flex-col transition-colors duration-300 ${themeConfig.bgClass}`}
          style={{ scrollbarWidth: "none" }}
        >
          {/* 상단 다이내믹 아일랜드 & 인디케이터 */}
          <div className="sticky top-0 z-20 pt-2.5 pb-2 px-6 flex items-center justify-between pointer-events-none">
            <span className="text-[11px] font-bold tracking-tight opacity-70">
              9:41
            </span>
            <div className="w-24 h-5 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1 opacity-70">
              <span className="text-[10px] font-bold">5G</span>
              <div className="w-4 h-2 border border-current rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-current rounded-2xs" />
              </div>
            </div>
          </div>

          {/* 프로필 본문 */}
          <div className="px-5 pt-4 pb-10 flex-1 flex flex-col items-center text-center">
            {/* 프로필 아바타 */}
            <div className="relative mb-4 group">
              <div className="w-24 h-24 rounded-full overflow-hidden p-1 bg-white/40 shadow-sm backdrop-blur-xs">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-linear-to-tr from-[#3182F6] to-sky-400 flex items-center justify-center text-white text-2xl font-black">
                    {profile.name ? profile.name.slice(0, 2) : "ML"}
                  </div>
                )}
              </div>
            </div>

            {/* 이름 및 직함 */}
            <h1
              className={`text-xl font-extrabold tracking-tight ${themeConfig.textPrimaryClass}`}
            >
              {profile.name || "이름을 입력하세요"}
            </h1>
            {profile.role && (
              <p
                className={`text-xs font-semibold mt-1 ${themeConfig.textSecondaryClass}`}
              >
                {profile.role}
              </p>
            )}

            {/* 소개글 */}
            {profile.bio && (
              <p
                className={`text-xs leading-relaxed mt-2.5 max-w-[280px] break-keep ${themeConfig.textSecondaryClass}`}
              >
                {profile.bio}
              </p>
            )}

            {/* 소셜 및 연락처 아이콘 바 */}
            {hasAnySocial && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    title="이메일 보내기"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    title="전화 연결"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    title="LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    title="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 shadow-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    title="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* 연락처 저장 (vCard) 버튼 */}
            <div className="w-full mt-4">
              <button
                onClick={handleDownloadVCard}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${themeConfig.primaryButtonClass}`}
              >
                <UserPlus className="w-4 h-4" />
                <span>연락처에 추가하기 (vCard)</span>
              </button>
            </div>

            {/* 링크 목록 */}
            <div className="w-full mt-6 space-y-2.5">
              {activeLinks.length === 0 ? (
                <div className="py-8 text-center opacity-60">
                  <p className="text-xs">활성화된 링크가 없습니다.</p>
                </div>
              ) : (
                activeLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={(e) => handleLinkClick(link.id, link.url, e)}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] group cursor-pointer ${themeConfig.linkItemClass} ${themeConfig.linkItemHoverClass}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <LinkIcon name={link.icon} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold truncate">
                          {link.title}
                        </span>
                        <span className="block text-[10px] opacity-60 truncate">
                          {link.url.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {link.clicks > 0 && (
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${themeConfig.accentBadgeClass}`}
                        >
                          <MousePointerClick className="w-2.5 h-2.5" />
                          {link.clicks}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* 푸터 */}
            <div className="mt-8 pt-4">
              <span className="text-[10px] font-semibold opacity-40 uppercase tracking-widest flex items-center justify-center gap-1">
                <span>✦</span> Powered by MyLink
              </span>
            </div>
          </div>

          {/* 하단 홈 바 */}
          <div className="w-32 h-1 bg-black/30 dark:bg-white/30 rounded-full mx-auto mb-2 shrink-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
