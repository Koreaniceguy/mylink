"use client";

import React, { useEffect, useState } from "react";
import { getUserByDisplayName, UserDocumentData } from "@/lib/userService";
import { getActiveLinksFromFirestore } from "@/lib/linksService";
import { PublicVisitorView } from "@/components/PublicVisitorView";
import { LinkItem } from "@/types";
import { Loader2 } from "lucide-react";

interface DynamicUserViewProps {
  displayName: string;
  initialUser: UserDocumentData;
  initialLinks: LinkItem[];
}

export function DynamicUserView({
  displayName,
  initialUser,
  initialLinks,
}: DynamicUserViewProps) {
  const [user, setUser] = useState<UserDocumentData>(initialUser);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // preview가 아닌 실제 닉네임이거나 클라이언트 사이드에서 실시간 데이터 갱신 필요시
    let isMounted = true;

    async function loadFreshData() {
      try {
        setLoading(true);
        const fetchedUser = await getUserByDisplayName(displayName);
        if (fetchedUser && isMounted) {
          setUser(fetchedUser);
          const fetchedLinks = await getActiveLinksFromFirestore(fetchedUser.uid);
          if (isMounted) {
            setLinks(fetchedLinks || []);
          }
        }
      } catch (err) {
        console.error("클라이언트 최신 사용자 데이터 조회 실패:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFreshData();

    return () => {
      isMounted = false;
    };
  }, [displayName]);

  if (loading && user.uid === "preview-user") {
    return (
      <div className="min-h-screen bg-[#F2F4F6] dark:bg-[#111317] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-[#E5E8EB] dark:border-zinc-800 shadow-xl shadow-black/5 text-center">
          <Loader2 className="w-8 h-8 text-[#3182F6] animate-spin" />
          <span className="text-xs font-semibold text-[#8B95A1]">
            ‘{displayName}’ 님의 최신 프로필을 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  return <PublicVisitorView user={user} initialLinks={links} />;
}
