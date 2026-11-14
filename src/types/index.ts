export interface ProfileInfo {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  clicks: number;
}

export type ThemeType = 'minimal-light' | 'modern-dark' | 'corporate-blue' | 'warm-beige';

export interface AnalyticsInfo {
  pageViews: number;
  updatedAt: string;
}

export interface MyLinkState {
  profile: ProfileInfo;
  contact: ContactInfo;
  links: LinkItem[];
  theme: ThemeType;
  analytics: AnalyticsInfo;
}

export const DEFAULT_PROFILE: ProfileInfo = {
  name: "홍길동",
  role: "Product Designer @ Acme Corp",
  bio: "디자인과 기술을 연결하여 일상의 복잡한 문제를 단순하게 해결합니다.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
};

export const DEFAULT_CONTACT: ContactInfo = {
  email: "gildong.hong@example.com",
  phone: "010-1234-5678",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
  instagram: "https://instagram.com",
};

export const DEFAULT_LINKS_DUMMY_DATA: LinkItem[] = [
  {
    id: "link-1",
    title: "GitHub 저장소",
    url: "https://github.com",
    icon: "github",
    isActive: true,
    clicks: 42,
  },
  {
    id: "link-2",
    title: "기술 블로그 & 기록",
    url: "https://velog.io",
    icon: "book-open",
    isActive: true,
    clicks: 28,
  },
  {
    id: "link-3",
    title: "온라인 이력서 & 포트폴리오",
    url: "https://notion.so",
    icon: "file-text",
    isActive: true,
    clicks: 65,
  },
  {
    id: "link-4",
    title: "최신 토이 프로젝트 데모",
    url: "https://vercel.app",
    icon: "rocket",
    isActive: true,
    clicks: 19,
  },
  {
    id: "link-5",
    title: "LinkedIn 프로필",
    url: "https://linkedin.com",
    icon: "linkedin",
    isActive: true,
    clicks: 34,
  },
  {
    id: "link-6",
    title: "Instagram",
    url: "https://instagram.com",
    icon: "instagram",
    isActive: false,
    clicks: 12,
  },
  {
    id: "link-7",
    title: "1:1 커피챗 & 오픈채팅",
    url: "https://open.kakao.com",
    icon: "message-circle",
    isActive: true,
    clicks: 15,
  },
  {
    id: "link-8",
    title: "비즈니스 문의 (Email)",
    url: "mailto:contact@example.com",
    icon: "mail",
    isActive: true,
    clicks: 8,
  },
];
