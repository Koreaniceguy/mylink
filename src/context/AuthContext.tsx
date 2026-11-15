"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { syncUserProfileToFirestore } from "@/lib/userService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  authErrorMessage: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getFriendlyAuthErrorMessage(error: any): string {
  const code = error?.code || "";
  switch (code) {
    case "auth/unauthorized-domain":
      return "Firebase 콘솔의 '승인된 도메인(Authorized Domains)'에 'koreaniceguy.github.io'가 등록되지 않아 로그인이 차단되었습니다. Firebase 콘솔에서 도메인을 추가해주세요.";
    case "auth/popup-blocked":
      return "브라우저 팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.";
    case "auth/popup-closed-by-user":
      return "사용자에 의해 Google 로그인 팝업 창이 닫혔습니다.";
    case "auth/cancelled-popup-request":
      return "진행 중인 다른 로그인 요청이 있어 취소되었습니다.";
    case "auth/network-request-failed":
      return "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
    default:
      return error?.message || "Google 로그인 중 알 수 없는 오류가 발생했습니다.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const clearAuthError = () => setAuthErrorMessage(null);

  useEffect(() => {
    // 1. 모바일 환경 등 signInWithRedirect 결과 확인
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          await syncUserProfileToFirestore(result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect 로그인 결과 오류:", error);
        setAuthErrorMessage(getFriendlyAuthErrorMessage(error));
      });

    // 2. 인증 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncUserProfileToFirestore(currentUser);
        } catch (error) {
          console.error("사용자 정보 Firestore 동기화 오류:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User | null> => {
    try {
      setAuthErrorMessage(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      console.error("Google 로그인 실패:", error);
      const friendlyMsg = getFriendlyAuthErrorMessage(error);
      setAuthErrorMessage(friendlyMsg);

      // 팝업이 차단된 경우 redirect 로그인 시도 가능
      if (error?.code === "auth/popup-blocked") {
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
          return null;
        } catch (redirectError) {
          console.error("Redirect 로그인 실패:", redirectError);
        }
      }

      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthErrorMessage(null);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
        authErrorMessage,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
