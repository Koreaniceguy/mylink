import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MyLinkState,
  ProfileInfo,
  ContactInfo,
  LinkItem,
  ThemeType,
  DEFAULT_PROFILE,
  DEFAULT_CONTACT,
  DEFAULT_LINKS_DUMMY_DATA,
} from "@/types";

interface MyLinkStore extends MyLinkState {
  // 프로필 & 연락처 액션
  updateProfile: (field: keyof ProfileInfo, value: string) => void;
  updateContact: (field: keyof ContactInfo, value: string) => void;

  // 링크 관리 액션
  addLink: (link: Omit<LinkItem, "id" | "clicks">) => void;
  updateLink: (id: string, updated: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (newLinks: LinkItem[]) => void;
  moveLink: (id: string, direction: "up" | "down") => void;
  toggleLinkActive: (id: string) => void;

  // 테마 & 통계 액션
  setTheme: (theme: ThemeType) => void;
  incrementPageView: () => void;
  incrementLinkClick: (linkId: string) => void;

  // 유틸리티 액션
  loadSampleData: () => void;
  resetToDefault: () => void;
}

const initialState: MyLinkState = {
  profile: DEFAULT_PROFILE,
  contact: DEFAULT_CONTACT,
  links: DEFAULT_LINKS_DUMMY_DATA,
  theme: "minimal-light",
  analytics: {
    pageViews: 128,
    updatedAt: new Date().toISOString(),
  },
};

export const useMyLinkStore = create<MyLinkStore>()(
  persist(
    (set) => ({
      ...initialState,

      updateProfile: (field, value) =>
        set((state) => ({
          profile: { ...state.profile, [field]: value },
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        })),

      updateContact: (field, value) =>
        set((state) => ({
          contact: { ...state.contact, [field]: value },
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        })),

      addLink: (link) =>
        set((state) => {
          const newLink: LinkItem = {
            ...link,
            id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            clicks: 0,
          };
          return {
            links: [newLink, ...state.links],
            analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
          };
        }),

      updateLink: (id, updated) =>
        set((state) => ({
          links: state.links.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        })),

      deleteLink: (id) =>
        set((state) => ({
          links: state.links.filter((item) => item.id !== id),
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        })),

      reorderLinks: (newLinks) =>
        set((state) => ({
          links: newLinks,
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        })),

      moveLink: (id, direction) =>
        set((state) => {
          const index = state.links.findIndex((item) => item.id === id);
          if (index === -1) return state;

          const targetIndex = direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.links.length) return state;

          const newLinks = [...state.links];
          const [movedItem] = newLinks.splice(index, 1);
          newLinks.splice(targetIndex, 0, movedItem);

          return {
            links: newLinks,
            analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
          };
        }),

      toggleLinkActive: (id) =>
        set((state) => ({
          links: state.links.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          ),
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        })),

      setTheme: (theme) =>
        set((state) => ({
          theme,
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        })),

      incrementPageView: () =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            pageViews: state.analytics.pageViews + 1,
            updatedAt: new Date().toISOString(),
          },
        })),

      incrementLinkClick: (linkId) =>
        set((state) => ({
          links: state.links.map((item) =>
            item.id === linkId ? { ...item, clicks: item.clicks + 1 } : item
          ),
          analytics: {
            ...state.analytics,
            updatedAt: new Date().toISOString(),
          },
        })),

      loadSampleData: () =>
        set(() => ({
          profile: { ...DEFAULT_PROFILE },
          contact: { ...DEFAULT_CONTACT },
          links: DEFAULT_LINKS_DUMMY_DATA.map((link) => ({ ...link })),
          theme: "minimal-light",
          analytics: {
            pageViews: 128,
            updatedAt: new Date().toISOString(),
          },
        })),

      resetToDefault: () =>
        set(() => ({
          profile: {
            name: "",
            role: "",
            bio: "",
            avatarUrl: "",
          },
          contact: {},
          links: [],
          theme: "minimal-light",
          analytics: {
            pageViews: 0,
            updatedAt: new Date().toISOString(),
          },
        })),
    }),
    {
      name: "mylink-storage-v1",
    }
  )
);
