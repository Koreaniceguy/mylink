import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { ProfileInfo, ContactInfo, ThemeType } from "@/types";

export interface UserDocumentData {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  profile?: Partial<ProfileInfo>;
  contact?: Partial<ContactInfo>;
  theme?: ThemeType;
  pageViews?: number;
  updatedAt?: unknown;
}

/**
 * displayName으로 Firestore users 컬렉션에서 단일 사용자를 검색합니다.
 * @param displayName 검색할 사용자 displayName (예: '홍길동', '승준')
 * @returns UserDocumentData 또는 null
 */
export async function getUserByDisplayName(displayName: string): Promise<UserDocumentData | null> {
  if (!displayName || !displayName.trim()) {
    return null;
  }

  const trimmedName = displayName.trim();
  const usersRef = collection(db, "users");

  // 1. displayName 필드로 검색
  let q = query(usersRef, where("displayName", "==", trimmedName), limit(1));
  let querySnapshot = await getDocs(q);

  // 2. 일치하는 결과가 없으면 profile.name 필드로 보조 검색
  if (querySnapshot.empty) {
    q = query(usersRef, where("profile.name", "==", trimmedName), limit(1));
    querySnapshot = await getDocs(q);
  }

  // 3. 일치하는 결과가 없으면 UID로 직접 조회 시도 (혹시 URL에 UID를 입력한 경우)
  if (querySnapshot.empty) {
    const directUser = await getUserById(trimmedName);
    if (directUser) {
      return directUser;
    }
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();

  return {
    uid: docSnap.id,
    displayName: data.displayName || trimmedName,
    email: data.email || "",
    photoURL: data.photoURL || "",
    profile: data.profile || {},
    contact: data.contact || {},
    theme: data.theme || "minimal-light",
    pageViews: data.pageViews || 0,
    updatedAt: data.updatedAt,
  };
}

/**
 * 사용자 UID로 사용자 문서 데이터를 직접 조회합니다.
 */
export async function getUserById(userId: string): Promise<UserDocumentData | null> {
  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    uid: docSnap.id,
    displayName: data.displayName || "사용자",
    email: data.email || "",
    photoURL: data.photoURL || "",
    profile: data.profile || {},
    contact: data.contact || {},
    theme: data.theme || "minimal-light",
    pageViews: data.pageViews || 0,
    updatedAt: data.updatedAt,
  };
}

/**
 * 로그인한 사용자의 정보를 Firestore users/{uid} 문서에 동기화합니다.
 */
export async function syncUserProfileToFirestore(
  user: User,
  additionalData?: {
    profile?: Partial<ProfileInfo>;
    contact?: Partial<ContactInfo>;
    theme?: ThemeType;
  }
): Promise<void> {
  if (!user || !user.uid) return;

  const userDocRef = doc(db, "users", user.uid);
  const nameToSave = user.displayName || additionalData?.profile?.name || "사용자";

  const payload: Record<string, unknown> = {
    uid: user.uid,
    displayName: nameToSave,
    email: user.email || "",
    photoURL: user.photoURL || additionalData?.profile?.avatarUrl || "",
    updatedAt: serverTimestamp(),
  };

  if (additionalData?.profile) {
    payload.profile = additionalData.profile;
  }
  if (additionalData?.contact) {
    payload.contact = additionalData.contact;
  }
  if (additionalData?.theme) {
    payload.theme = additionalData.theme;
  }

  await setDoc(userDocRef, payload, { merge: true });
}

/**
 * 특정 사용자의 프로필, 연락처, 테마 정보를 Firestore에 업데이트합니다.
 */
export async function updateUserDataInFirestore(
  userId: string,
  data: {
    displayName?: string;
    profile?: Partial<ProfileInfo>;
    contact?: Partial<ContactInfo>;
    theme?: ThemeType;
  }
): Promise<void> {
  const userDocRef = doc(db, "users", userId);
  const payload: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  await setDoc(userDocRef, payload, { merge: true });
}

/**
 * 방문자 접속 시 해당 사용자의 프로필 조회수를 1 증가시킵니다.
 */
export async function incrementUserPageView(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      pageViews: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("프로필 조회수 업데이트 실패:", error);
  }
}

/**
 * 특정 사용자의 특정 링크 클릭 수를 1 증가시킵니다.
 * 경로: users/{userId}/links/{linkId}
 */
export async function incrementLinkClickInFirestore(
  userId: string,
  linkId: string
): Promise<void> {
  try {
    const linkDocRef = doc(db, "users", userId, "links", linkId);
    await updateDoc(linkDocRef, {
      clicks: increment(1),
    });
  } catch (error) {
    console.warn("링크 클릭 수 업데이트 실패:", error);
  }
}
