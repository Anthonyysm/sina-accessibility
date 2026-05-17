/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export type UserRole = "interprete" | "estudante";
export type BackendUserRole = "INTERPRETE" | "ESTUDANTE";

async function fetchJson(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Erro ${response.status}`);
  }

  return payload;
}

async function saveGoogleUserToDb(user: any, role?: UserRole) {
  const email = user?.email;
  const name = user?.displayName ?? "";

  if (!email || typeof email !== "string") {
    throw new Error("Não foi possível obter o e-mail do usuário Google.");
  }

  const response = await fetchJson("/api/auth/google-signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, role }),
  });

  return response;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

function validatePassword(password: string) {
  if (!password || password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }
}

export const signUpWithEmail = async (data: SignUpData) => {
  try {
    const { email, password, name, role } = data;

    validatePassword(password);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    await updateProfile(user, {
      displayName: name,
    });

    const registerResult = await fetchJson("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, role }),
    });

    const idToken = await user.getIdToken();
    const sessionResult = await fetchJson("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, email }),
    });

    return { user, role: registerResult.user.role as BackendUserRole };
  } catch (error: any) {
    console.error("Erro ao criar conta:", error);
    throw error;
  }
};

export const signInWithEmail = async (data: SignInData) => {
  try {
    const { email, password } = data;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    const sessionResult = await fetchJson("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: await user.getIdToken(), email }),
    });

    return { user, role: sessionResult.role as BackendUserRole };
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const signInWithGoogle = async (role?: UserRole) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;

    await saveGoogleUserToDb(user, role);

    const idToken = await user.getIdToken();
    const sessionData = await fetchJson("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, email: user.email }),
    });

    return { user, role: sessionData.role };
  } catch (error: any) {
    console.error("Erro ao fazer login com Google:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(auth).catch(() => {});
  } catch (error: any) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};