import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../infra/firebaseService";

export async function getUserRole(uid: string): Promise<string> {
  if (!uid) return "user";

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return "user";

  return snap.data()?.role ?? "user";
}

export async function createUserDoc(uid: string) {
  const ref = doc(db, "users", uid);

  try {
    await setDoc(ref, {
      role: "user",
      createdAt: Date.now(),
    });
  } catch (err) {
    console.error("Erro ao criar user doc:", err);
  }
}
