import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadMedia(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
  const ext = file.name.split('.').pop() || '';
  const fileName = `${uuidv4()}.${ext}`;
  const path = `media/${userId}/${fileName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
}

export async function deleteMedia(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export function getMediaType(file: File): 'image' | 'video' {
  return file.type.startsWith('video/') ? 'video' : 'image';
}

export function getMediaFormat(file: File): string {
  return file.name.split('.').pop()?.toLowerCase() || 'unknown';
}
