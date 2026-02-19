import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, SocialAccount, MediaFile, Publication } from '@/types';

// Users
export async function createUser(user: User): Promise<void> {
  await setDoc(doc(db, 'users', user.uid), user);
}

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() });
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => d.data() as User);
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid));
}

// Social Accounts
export async function addSocialAccount(account: SocialAccount): Promise<void> {
  await setDoc(doc(db, 'socialAccounts', account.id), account);
}

export async function getUserSocialAccounts(userId: string): Promise<SocialAccount[]> {
  const q = query(collection(db, 'socialAccounts'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SocialAccount);
}

export async function removeSocialAccount(id: string): Promise<void> {
  await deleteDoc(doc(db, 'socialAccounts', id));
}

export async function updateSocialAccount(
  id: string,
  data: Partial<SocialAccount>
): Promise<void> {
  await updateDoc(doc(db, 'socialAccounts', id), data);
}

// Media Files
export async function addMediaFile(media: MediaFile): Promise<void> {
  await setDoc(doc(db, 'mediaFiles', media.id), media);
}

export async function getUserMediaFiles(userId: string): Promise<MediaFile[]> {
  const q = query(
    collection(db, 'mediaFiles'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as MediaFile);
}

export async function deleteMediaFile(id: string): Promise<void> {
  await deleteDoc(doc(db, 'mediaFiles', id));
}

// Publications
export async function createPublication(pub: Publication): Promise<void> {
  await setDoc(doc(db, 'publications', pub.id), pub);
}

export async function getPublication(id: string): Promise<Publication | null> {
  const snap = await getDoc(doc(db, 'publications', id));
  return snap.exists() ? (snap.data() as Publication) : null;
}

export async function getUserPublications(userId: string): Promise<Publication[]> {
  const q = query(
    collection(db, 'publications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Publication);
}

export async function getUserDrafts(userId: string): Promise<Publication[]> {
  const q = query(
    collection(db, 'publications'),
    where('userId', '==', userId),
    where('status', '==', 'draft'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Publication);
}

export async function getUserScheduled(userId: string): Promise<Publication[]> {
  const q = query(
    collection(db, 'publications'),
    where('userId', '==', userId),
    where('status', '==', 'scheduled'),
    orderBy('scheduledAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Publication);
}

export async function updatePublication(
  id: string,
  data: Partial<Publication>
): Promise<void> {
  await updateDoc(doc(db, 'publications', id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePublication(id: string): Promise<void> {
  await deleteDoc(doc(db, 'publications', id));
}
