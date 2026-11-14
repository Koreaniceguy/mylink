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

import {
  addLinkToFirestore,
  getLinksFromFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from "@/lib/linksService";
import {
  getUserById,
  updateUserDataInFirestore,
} from "@/lib/userService";

interface MyLinkStore extends MyLinkState {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
  fetchUserLinks: (userId: string) => Promise<void>;

  // 프로필 & 연락처 액션
  updateProfile: (field: keyof ProfileInfo, value: string) => void;
  updateContact: (field: keyof ContactInfo, value: string) => void;

  // 링크 관리 액션
  addLink: (link: Omit<LinkItem, "id" | "clicks">) => Promise<LinkItem>;
  updateLink: (id: string, updated: Partial<LinkItem>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (newLinks: LinkItem[]) => void;
  moveLink: (id: string, direction: "up" | "down") => void;
  toggleLinkActive: (id: string) => Promise<void>;

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
    (set, get) => ({
      ...initialState,
      currentUserId: null,

      setCurrentUserId: (id) => set({ currentUserId: id }),

      fetchUserLinks: async (userId: string) => {
        try {
          // 1. 유저 링크 로드
          const userLinks = await getLinksFromFirestore(userId);
          if (userLinks && userLinks.length > 0) {
            set((state) => ({
              links: userLinks,
              analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
            }));
          }

          // 2. 유저 정보(프로필/연락처/테마) 로드 및 동기화
          const userData = await getUserById(userId);
          if (userData) {
            set((state) => ({
              profile: {
                ...state.profile,
                ...(userData.profile || {}),
                name: userData.displayName || userData.profile?.name || state.profile.name,
                avatarUrl: userData.photoURL || userData.profile?.avatarUrl || state.profile.avatarUrl,
              },
              contact: {
                ...state.contact,
                ...(userData.contact || {}),
              },
              theme: userData.theme || state.theme,
            }));
          }
        } catch (error) {
          console.error("Firestore 유저 및 링크 불러오기 실패:", error);
        }
      },

      updateProfile: (field, value) => {
        set((state) => {
          const newProfile = { ...state.profile, [field]: value };
          const userId = state.currentUserId;
          if (userId) {
            const dataToUpdate: Record<string, unknown> = {
              profile: newProfile,
            };
            if (field === "name" && value.trim()) {
              dataToUpdate.displayName = value.trim();
            }
            if (field === "avatarUrl") {
              dataToUpdate.photoURL = value;
            }
            updateUserDataInFirestore(userId, dataToUpdate).catch((e) =>
              console.error("Firestore 프로필 동기화 오류:", e)
            );
          }
          return {
            profile: newProfile,
            analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
          };
        });
      },

      updateContact: (field, value) => {
        set((state) => {
          const newContact = { ...state.contact, [field]: value };
          const userId = state.currentUserId;
          if (userId) {
            updateUserDataInFirestore(userId, { contact: newContact }).catch((e) =>
              console.error("Firestore 연락처 동기화 오류:", e)
            );
          }
          return {
            contact: newContact,
            analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
          };
        });
      },

      addLink: async (link) => {
        const userId = get().currentUserId;
        let savedLink: LinkItem;

        if (userId) {
          savedLink = await addLinkToFirestore(userId, link);
        } else {
          savedLink = {
            id: `link-${Date.now()}`,
            title: link.title,
            url: link.url,
            icon: link.icon || "globe",
            isActive: link.isActive ?? true,
            clicks: 0,
          };
        }

        set((state) => ({
          links: [savedLink, ...state.links],
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        }));
        return savedLink;
      },

      updateLink: async (id, updated) => {
        const userId = get().currentUserId;
        if (userId) {
          await updateLinkInFirestore(userId, id, updated);
        }
        set((state) => ({
          links: state.links.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        }));
      },

      deleteLink: async (id) => {
        const userId = get().currentUserId;
        if (userId) {
          await deleteLinkFromFirestore(userId, id);
        }
        set((state) => ({
          links: state.links.filter((item) => item.id !== id),
          analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
        }));
      },

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

      toggleLinkActive: async (id) => {
        let newActiveState = true;
        set((state) => {
          const target = state.links.find((item) => item.id === id);
          if (target) {
            newActiveState = !target.isActive;
          }
          return {
            links: state.links.map((item) =>
              item.id === id ? { ...item, isActive: !item.isActive } : item
            ),
            analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
          };
        });

        const userId = get().currentUserId;
        if (userId) {
          try {
            await updateLinkInFirestore(userId, id, { isActive: newActiveState });
          } catch (e) {
            console.error("토글 상태 Firestore 동기화 실패:", e);
          }
        }
      },

      setTheme: (theme) => {
        set((state) => {
          const userId = state.currentUserId;
          if (userId) {
            updateUserDataInFirestore(userId, { theme }).catch((e) =>
              console.error("Firestore 테마 동기화 오류:", e)
            );
          }
          return {
            theme,
            analytics: { ...state.analytics, updatedAt: new Date().toISOString() },
          };
        });
      },

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
      partialize: (state) => ({
        profile: state.profile,
        contact: state.contact,
        links: state.links,
        theme: state.theme,
        analytics: state.analytics,
      }),
    }
  )
);
