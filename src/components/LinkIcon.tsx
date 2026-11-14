import React from "react";
import {
  BookOpen,
  FileText,
  Rocket,
  MessageCircle,
  Mail,
  Globe,
  Code,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";

interface LinkIconProps {
  name?: string;
  className?: string;
}

export function LinkIcon({ name, className = "w-4 h-4" }: LinkIconProps) {
  const iconKey = name?.toLowerCase().trim();

  switch (iconKey) {
    case "github":
      return <GithubIcon className={className} />;
    case "linkedin":
      return <LinkedinIcon className={className} />;
    case "instagram":
      return <InstagramIcon className={className} />;
    case "book-open":
    case "blog":
    case "velog":
      return <BookOpen className={className} />;
    case "file-text":
    case "notion":
    case "resume":
      return <FileText className={className} />;
    case "rocket":
    case "project":
    case "demo":
      return <Rocket className={className} />;
    case "message-circle":
    case "chat":
    case "kakao":
      return <MessageCircle className={className} />;
    case "mail":
    case "email":
      return <Mail className={className} />;
    case "code":
      return <Code className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "bookmark":
      return <Bookmark className={className} />;
    default:
      return <Globe className={className} />;
  }
}

export const AVAILABLE_ICONS = [
  { id: "github", label: "GitHub", component: GithubIcon },
  { id: "linkedin", label: "LinkedIn", component: LinkedinIcon },
  { id: "instagram", label: "Instagram", component: InstagramIcon },
  { id: "book-open", label: "블로그 / Velog", component: BookOpen },
  { id: "file-text", label: "이력서 / Notion", component: FileText },
  { id: "rocket", label: "프로젝트 / 데모", component: Rocket },
  { id: "message-circle", label: "오픈채팅 / 카카오", component: MessageCircle },
  { id: "mail", label: "이메일", component: Mail },
  { id: "code", label: "개발 / 코드", component: Code },
  { id: "globe", label: "웹사이트", component: Globe },
];
