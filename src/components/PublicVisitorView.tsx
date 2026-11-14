"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { THEME_CONFIGS } from "@/lib/themeStyles";
import { LinkIcon } from "@/components/LinkIcon";
import { downloadVCard } from "@/lib/vcard";
import { ToastProvider, useToast } from "@/components/Toast";
import { incrementLinkClickInFirestore, incrementUserPageView, UserDocumentData } from "@/lib/userService";
import { LinkItem, ProfileInfo, ContactInfo } from "@/types";
import {
  Mail,
  Phone,
  UserPlus,
  ChevronRight,
  Share2,
  MousePointerClick,
  Sparkles,
  Link2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";

interface PublicVisitorViewProps {
  user: UserDocumentData;
  initialLinks: LinkItem[];
}

function VisitorContent({ user, initialLinks }: PublicVisitorViewProps) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const { showToast } = useToast();

  const theme = user.theme || "minimal-light";
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS["minimal-light"];

  const profile: ProfileInfo = {
    name: user.displayName || user.profile?.name || "사용자",
    role: user.profile?.role || "",
    bio: user.profile?.bio || "",
    avatarUrl: user.photoURL || user.profile?.avatarUrl || "",
  };

  const contact: ContactInfo = user.contact || {};

  useEffect(() => {
    // 페이지 접속 시 프로필 조회수 1 증가
    if (user.uid) {
      incrementUserPageView(user.uid);
    }
  }, [user.uid]);

  const handleLinkClick = async (linkId: string, url: string, e: React.MouseEvent) => {
    e.preventDefault();

    // 로컬 상태 즉시 증가 피드백
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, clicks: (l.clicks || 0) + 1 } : l))
    );

    // Firestore 클릭 수 증가
    if (user.uid) {
      incrementLinkClickInFirestore(user.uid, linkId);
    }

    // 대상 URL 이동
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadVCard = () => {
    downloadVCard(profile, contact);
    showToast("연락처(vCard)가 성공적으로 저장되었습니다! 📇", "success");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 주소가 복사되었습니다. 원하는 곳에 공유해보세요! 🚀", "success");
    }
  };

  const hasAnySocial =
    contact.email ||
    contact.phone ||
    contact.linkedin ||
    contact.github ||
    contact.instagram;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300 ${themeConfig.bgClass}`}
    >
      <div className="w-full max-w-md relative">
        {/* 상단 네비게이션: 홈 이동 & 공유 버튼 */}
        <div className="flex items-center justify-between mb-4 px-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-black/5 dark:border-white/10 text-xs font-bold text-[#191F28] dark:text-white shadow-xs hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            <div className="w-4 h-4 rounded-md bg-[#3182F6] flex items-center justify-center text-white">
              <Link2 className="w-2.5 h-2.5" />
            </div>
            <span>MyLink 만들기</span>
          </Link>

          <button
            onClick={handleShare}
            className={`p-2.5 rounded-full border shadow-xs transition-all active:scale-95 ${themeConfig.cardBgClass} ${themeConfig.borderClass} ${themeConfig.textPrimaryClass}`}
            title="프로필 공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 메인 프로필 카드 */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${themeConfig.cardBgClass} ${themeConfig.borderClass}`}
        >
          {/* 아바타 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5 group">
              <div className="w-28 h-28 rounded-full overflow-hidden p-1 bg-white/60 dark:bg-zinc-800/60 shadow-md backdrop-blur-xs">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#3182F6] to-sky-400 flex items-center justify-center text-white text-3xl font-black">
                    {profile.name ? profile.name.slice(0, 2) : "ML"}
                  </div>
                )}
              </div>
            </div>

            {/* 이름 및 직함 */}
            <h1
              className={`text-2xl font-black tracking-tight ${themeConfig.textPrimaryClass}`}
            >
              {profile.name}
            </h1>
            {profile.role && (
              <p
                className={`text-sm font-semibold mt-1.5 ${themeConfig.textSecondaryClass}`}
              >
                {profile.role}
              </p>
            )}

            {/* 소개글 */}
            {profile.bio && (
              <p
                className={`text-sm leading-relaxed mt-3 max-w-xs break-keep ${themeConfig.textSecondaryClass}`}
              >
                {profile.bio}
              </p>
            )}

            {/* 소셜 및 연락처 빠른 아이콘 */}
            {hasAnySocial && (
              <div className="flex items-center justify-center gap-2.5 mt-5">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="w-9 h-9 rounded-full bg-[#F2F4F6] dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs"
                    title="이메일"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="w-9 h-9 rounded-full bg-[#F2F4F6] dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs"
                    title="전화"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#F2F4F6] dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs"
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
                    className="w-9 h-9 rounded-full bg-[#F2F4F6] dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs"
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
                    className="w-9 h-9 rounded-full bg-[#F2F4F6] dark:bg-zinc-800 text-[#4E5968] dark:text-zinc-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs"
                    title="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* 연락처 저장 (vCard) 액션 버튼 */}
            <div className="w-full mt-6">
              <button
                type="button"
                onClick={handleDownloadVCard}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${themeConfig.primaryButtonClass}`}
              >
                <UserPlus className="w-4 h-4" />
                <span>연락처에 저장하기 (vCard)</span>
              </button>
            </div>
          </div>

          {/* 링크 목록: users/{userId}/links */}
          <div className="w-full mt-7 space-y-3">
            {links.length === 0 ? (
              <div className="py-10 text-center opacity-60">
                <p className="text-sm">현재 공개된 링크가 없습니다.</p>
              </div>
            ) : (
              links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={(e) => handleLinkClick(link.id, link.url, e)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] group cursor-pointer ${themeConfig.linkItemClass} ${themeConfig.linkItemHoverClass}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <LinkIcon name={link.icon} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-bold truncate">
                        {link.title}
                      </span>
                      <span className="block text-xs opacity-60 truncate mt-0.5">
                        {link.url.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {(link.clicks ?? 0) > 0 && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${themeConfig.accentBadgeClass}`}
                      >
                        <MousePointerClick className="w-3 h-3" />
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
          <div className="mt-10 pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-semibold opacity-50 hover:opacity-100 tracking-wider inline-flex items-center gap-1.5 transition-opacity"
            >
              <Sparkles className="w-3 h-3 text-[#3182F6]" />
              <span>나만의 무료 MyLink 만들기</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicVisitorView(props: PublicVisitorViewProps) {
  return (
    <ToastProvider>
      <VisitorContent {...props} />
    </ToastProvider>
  );
}
