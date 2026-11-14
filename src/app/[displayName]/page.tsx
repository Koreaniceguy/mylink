import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserByDisplayName } from "@/lib/userService";
import { getActiveLinksFromFirestore } from "@/lib/linksService";
import { PublicVisitorView } from "@/components/PublicVisitorView";

interface PageProps {
  params: Promise<{
    displayName: string;
  }>;
}

export async function generateStaticParams() {
  return [{ displayName: "preview" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { displayName } = await params;
  const decodedDisplayName = decodeURIComponent(displayName);

  return {
    title: `${decodedDisplayName}님의 마이링크 (MyLink)`,
    description: `${decodedDisplayName}님의 공식 링크 모음 및 프로필 명함 페이지입니다.`,
    openGraph: {
      title: `${decodedDisplayName}님의 마이링크`,
      description: `${decodedDisplayName}님의 프로필 및 주요 링크를 확인해보세요.`,
    },
  };
}

export default async function UserDynamicPage({ params }: PageProps) {
  const { displayName } = await params;
  const decodedDisplayName = decodeURIComponent(displayName);

  // 1. displayName으로 Firestore users 컬렉션에서 단일 사용자 검색 (where 쿼리)
  let user = null;
  try {
    user = await getUserByDisplayName(decodedDisplayName);
  } catch {
    user = null;
  }

  const targetUser = user || {
    uid: "preview-user",
    displayName: decodedDisplayName,
    profile: {
      bio: "마이링크 프로필에 오신 것을 환영합니다.",
      occupation: "크리에이터",
    },
    theme: "toss" as const,
    pageViews: 0,
  };

  // 3. 해당 사용자의 활성화된 링크 목록 조회 (users/{userId}/links)
  let links: any[] = [];
  if (user) {
    try {
      links = await getActiveLinksFromFirestore(user.uid);
    } catch {
      links = [];
    }
  }

  return (
    <main>
      <PublicVisitorView user={targetUser as any} initialLinks={links} />
    </main>
  );
}
