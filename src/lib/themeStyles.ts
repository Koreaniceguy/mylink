import { ThemeType } from "@/types";

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  bgClass: string;
  cardBgClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  borderClass: string;
  primaryButtonClass: string;
  linkItemClass: string;
  linkItemHoverClass: string;
  accentBadgeClass: string;
  previewColor: string;
}

export const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  "minimal-light": {
    id: "minimal-light",
    name: "미니멀 라이트 (TDS)",
    description: "토스 시그니처 룩. 클린 화이트 & 미색 배경과 토스 블루",
    bgClass: "bg-[#F2F4F6]",
    cardBgClass: "bg-white",
    textPrimaryClass: "text-[#191F28]",
    textSecondaryClass: "text-[#8B95A1]",
    borderClass: "border-[#E5E8EB]",
    primaryButtonClass: "bg-[#3182F6] hover:bg-[#1B64DA] text-white active:scale-[0.98]",
    linkItemClass: "bg-white text-[#191F28] border border-[#E5E8EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
    linkItemHoverClass: "hover:border-[#3182F6]/50 hover:bg-[#F9FAFB]",
    accentBadgeClass: "bg-[#E8F3FF] text-[#3182F6]",
    previewColor: "#3182F6",
  },
  "modern-dark": {
    id: "modern-dark",
    name: "모던 다크",
    description: "딥 차콜/다크 배경, 차분한 화이트 텍스트 & 네온 블루",
    bgClass: "bg-[#111317]",
    cardBgClass: "bg-[#1A1D24]",
    textPrimaryClass: "text-[#F9FAFB]",
    textSecondaryClass: "text-[#9CA3AF]",
    borderClass: "border-[#2A2E39]",
    primaryButtonClass: "bg-[#3B82F6] hover:bg-[#2563EB] text-white active:scale-[0.98]",
    linkItemClass: "bg-[#1A1D24] text-[#F9FAFB] border border-[#2A2E39] shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
    linkItemHoverClass: "hover:border-[#3B82F6]/60 hover:bg-[#222630]",
    accentBadgeClass: "bg-[#1E293B] text-[#60A5FA]",
    previewColor: "#111317",
  },
  "corporate-blue": {
    id: "corporate-blue",
    name: "코퍼레이트 블루",
    description: "신뢰감을 주는 로열 블루 포인트의 비즈니스 룩",
    bgClass: "bg-[#F0F4F9]",
    cardBgClass: "bg-white",
    textPrimaryClass: "text-[#0F172A]",
    textSecondaryClass: "text-[#64748B]",
    borderClass: "border-[#CBD5E1]",
    primaryButtonClass: "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white active:scale-[0.98]",
    linkItemClass: "bg-white text-[#0F172A] border border-[#E2E8F0] shadow-[0_2px_6px_rgba(29,78,216,0.06)]",
    linkItemHoverClass: "hover:border-[#1D4ED8]/60 hover:bg-[#F8FAFC]",
    accentBadgeClass: "bg-[#DBEAFE] text-[#1D4ED8]",
    previewColor: "#1D4ED8",
  },
  "warm-beige": {
    id: "warm-beige",
    name: "웜 베이지",
    description: "부드러운 크림/베이지 톤의 따뜻하고 감성적인 디자인",
    bgClass: "bg-[#F7F4EE]",
    cardBgClass: "bg-[#FFFDF9]",
    textPrimaryClass: "text-[#292524]",
    textSecondaryClass: "text-[#78716C]",
    borderClass: "border-[#E7E2D8]",
    primaryButtonClass: "bg-[#A16207] hover:bg-[#854D0E] text-white active:scale-[0.98]",
    linkItemClass: "bg-[#FFFDF9] text-[#292524] border border-[#E7E2D8] shadow-[0_2px_6px_rgba(120,113,108,0.06)]",
    linkItemHoverClass: "hover:border-[#A16207]/60 hover:bg-[#FDFBF7]",
    accentBadgeClass: "bg-[#FEF3C7] text-[#92400E]",
    previewColor: "#D97706",
  },
};
