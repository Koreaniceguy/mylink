import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkItem } from "@/types";

/**
 * Firestore users/(userId)/links 컬렉션 참조 반환
 */
export function getLinksCollectionRef(userId: string) {
  return collection(db, "users", userId, "links");
}

/**
 * Firestore에 새 링크를 추가합니다.
 * 경로: users/(userId)/links
 */
export async function addLinkToFirestore(
  userId: string,
  link: Omit<LinkItem, "id" | "clicks">
): Promise<LinkItem> {
  const collectionRef = getLinksCollectionRef(userId);

  const newDocData = {
    title: link.title,
    url: link.url,
    icon: link.icon || "globe",
    isActive: link.isActive ?? true,
    clicks: 0,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collectionRef, newDocData);

  return {
    id: docRef.id,
    title: link.title,
    url: link.url,
    icon: link.icon || "globe",
    isActive: link.isActive ?? true,
    clicks: 0,
  };
}

/**
 * Firestore에서 해당 사용자의 모든 링크를 조회합니다.
 * 경로: users/(userId)/links
 */
export async function getLinksFromFirestore(userId: string): Promise<LinkItem[]> {
  const collectionRef = getLinksCollectionRef(userId);
  const q = query(collectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title || "",
      url: data.url || "",
      icon: data.icon || "globe",
      isActive: data.isActive ?? true,
      clicks: data.clicks ?? 0,
    };
  });
}

/**
 * Firestore의 링크를 수정합니다.
 * 경로: users/(userId)/links/(id)
 */
export async function updateLinkInFirestore(
  userId: string,
  id: string,
  updated: Partial<Omit<LinkItem, "id">>
): Promise<void> {
  const docRef = doc(db, "users", userId, "links", id);
  await setDoc(
    docRef,
    {
      ...updated,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Firestore의 링크를 삭제합니다.
 * 경로: users/(userId)/links/(id)
 */
export async function deleteLinkFromFirestore(userId: string, id: string): Promise<void> {
  const docRef = doc(db, "users", userId, "links", id);
  await deleteDoc(docRef);
}

/**
 * Firestore에서 해당 사용자의 활성화된(isActive === true) 링크만 조회합니다.
 * 경로: users/(userId)/links
 */
export async function getActiveLinksFromFirestore(userId: string): Promise<LinkItem[]> {
  try {
    const allLinks = await getLinksFromFirestore(userId);
    return allLinks.filter((item) => item.isActive);
  } catch (error) {
    console.error("활성 링크 불러오기 실패:", error);
    return [];
  }
}

